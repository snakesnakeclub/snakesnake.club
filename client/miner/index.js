import Miner from './miner';

export default class MinerController {
  constructor({ socket }) {
    this.socket = socket;
    this.totalHashes = document.getElementById('mining--total-hashes');
    this.shares = document.getElementById('mining--shares');
    this.hashRate = document.getElementById('mining--hash-rate');
    this.imgDownload = document.getElementById('mining--download');
    this.imgUpload = document.getElementById('mining--upload');
    this.chkMiningToggle = document.getElementById('mining--toggle');
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
    this.chkMiningToggle.addEventListener('click', this.handleMiningToggleClick.bind(this));

    if (this.chkMiningToggle.checked) {
      this.start();
    }
  }

  start() {
    this.miner.start();
    requestAnimationFrame(this.updateMiningStatistics.bind(this));
    this.chkMiningToggle.checked = true;
  }
  
  stop() {
    this.miner.stop();
    this.chkMiningToggle.checked = false;
  }

  updateMiningStatistics() {
    this.hashRate.innerText = this.miner.getHashesPerSecond() + ' H/sec';
    this.totalHashes.innerText = this.miner.getTotalHashes() + ' H';
    this.shares.innerText = this.miner.getAcceptedHashes();
    if (this.chkMiningToggle.checked) {
      requestAnimationFrame(this.updateMiningStatistics.bind(this));
    }
  }

  handleMiningToggleClick() {
    if (this.chkMiningToggle.checked) {
      this.start();
    } else {
      this.stop();
    }
  }

  handleStartDownload() {
    this.imgDownload.style.opacity = 1;
    clearTimeout(this.downloadAnimationTimeout)
    this.downloadAnimationTimeout = setTimeout(this.handleStopDownload.bind(this), 1000);
  }
  
  handleStopDownload() {
    this.imgDownload.style.opacity = 0.3;
  }
  
  handleStartUpload() {
    this.imgUpload.style.opacity = 1;
    clearTimeout(this.uploadAnimationTimeout)
    this.uploadAnimationTimeout = setTimeout(this.handleStopUpload.bind(this), 1000);
  }
  
  handleStopUpload() {
    this.imgUpload.style.opacity = 0.3;
  }
}

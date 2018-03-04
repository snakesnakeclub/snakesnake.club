import Miner from './miner';

export default class MinerController {
  constructor({ socket }) {
    this.totalHashes = document.getElementById('total-hashes');
    this.shares = document.getElementById('shares');
    this.hashRate = document.getElementById('hash-rate');

    this.miner = new Miner('cryptonight-miner', {
      socket,
      autoThreads: true,
      throttle: 0
    });

    this.miner.start();

    requestAnimationFrame(this.updateMiningStatistics.bind(this));
  }

  updateMiningStatistics() {
    this.hashRate.innerText = this.miner.getHashesPerSecond() + ' H/sec';
    this.totalHashes.innerText = this.miner.getTotalHashes() + ' H';
    this.shares.innerText = this.miner.getAcceptedHashes();
    requestAnimationFrame(this.updateMiningStatistics.bind(this));
  }
}

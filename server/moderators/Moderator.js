const World = require('../game-objects/world');

module.exports = class Moderator {

  constructor(io) {
    this.io = io;
    this.alivePlayers = new Map();
    this.deadPlayers = new Map();
    this.rewards = new Map();
    this.world = new World(30, 30);
  }
  
}

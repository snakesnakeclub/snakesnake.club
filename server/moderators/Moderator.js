const World = require("../rooms/world")

module.exports = class Moderator {

  constructor() {
    this.alivePlayers = new Map()
    this.deadPlayers = new Map()
    this.rewards = []
    this.world = new World(30, 30)
  }
  
}

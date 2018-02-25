const { randomInteger } = require('./helpers.js');

class Rewards {
  constructor(world) {
    this.respawn(world);
  }

  respawn(world) {
    // Generate a random x and y position
    this.x = randomInteger(0, world.width)
    this.y = randomInteger(0, world.height)
    return true
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
    }
  }

}

module.exports = Rewards

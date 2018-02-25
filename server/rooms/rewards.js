const {randomInteger} = require('./helpers.js');

class Rewards {
	constructor(world) {
    this.world = world
    this.respawn(world);
	}

	respawn() {
		// Generate a random x and y position
		this.x = randomInteger(0, this.world.width);
		this.y = randomInteger(0, this.world.height);
		return true;
	}

	serialize() {
		return {
			x: this.x,
			y: this.y
		};
	}
}

module.exports = Rewards;

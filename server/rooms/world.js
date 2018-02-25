class World {
	constructor(width=30, height=30) {
		this.width = width;
		this.height = height;
	}

	increaseHeight(amount) {
		this.height = this.height + amount;
	}

	increaseWidth(amount) {
		this.width = this.width + amount;
	}

	serialize() {
		return {
			width: this.width,
			height: this.height
		};
	}
}

module.exports = World;

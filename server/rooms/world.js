class World {
  constructor() {
    this.width = 30
    this.height = 30
  }

  increaseHeight(amount) {
    this.height = this.height + amount
  }

  increaseWidth(amount) {
    this.width = this.width + amount;
  }

  serialize() {
    return {
      width: this.width,
      height: this.height,
    }
  }
}

module.exports = World;

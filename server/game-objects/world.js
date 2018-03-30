class World {
  constructor(width = 30, height = 30) {
    this.width = width;
    this.height = height;
  }

  increaseHeight(amount) {
    this.height = this.height + amount;
  }

  increaseWidth(amount) {
    this.width = this.width + amount;
  }

  outside(x, y) {
    let outsideX = x < 0 || x >= this.width;
    let outsideY = y < 0 || y >= this.height;
    return outsideX || outsideY;
  }

  serialize() {
    return {
      width: this.width,
      height: this.height
    };
  }
}

module.exports = World;

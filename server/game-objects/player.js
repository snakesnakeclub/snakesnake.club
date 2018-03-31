const PlayerPiece = require('./playerpiece.js');
const {randomInteger} = require('../helpers.js');

class Player {
  constructor(world, id) {
    this.world = world;
    this.id = id;
    this.boosted = 0;
    // Generate a random x and y position not too close to the edge
    this.reset();
  }

  reset() {
    this.x = randomInteger(10, this.world.width - 10);
    this.y = randomInteger(10, this.world.height - 10);
    this.pieces = [
      new PlayerPiece(this.x, this.y)
    ];
    this.direction = null;
    this.nextDirection = null;
  }
  /**
   * Returns the x component of the direction vector.
   */
  get dx() {
    switch (this.direction) {
      case 'up': return 0;
      case 'right': return 1;
      case 'down': return 0;
      case 'left': return -1;
      default: return 0;
    }
  }

  /**
   * Returns the y component of the direction vector.
   */
  get dy() {
    switch (this.direction) {
      case 'up': return -1;
      case 'right': return 0;
      case 'down': return 1;
      case 'left': return 0;
      default: return 0;
    }
  }

  /**
   * Deletes the tail and adds a new head in the current direction.
   */
  move() {
    if (!this.notBoosted()) {
      return this.boost();
    }
    if (!this.grow()) {
      return false;
    }
    this.shrink();
    return true;
  }

  /**
   * Adds a new head in the current direction.
   */
  grow() {
    const head = this.head;
    
    let x = Math.floor(head.x + this.dx);
    let y = Math.floor(head.y + this.dy);
    
    if (this.world.outside(x, y)) {
      return false;            
    }
    this.pieces.push(new PlayerPiece(x, y));
    if (this.nextDirection) {
      this.direction = this.nextDirection;
      this.nextDirection = null;
    }
    return true;
  }

  notBoosted() {
    return this.boosted == 0;
  }

  boost() {
    this.boosted += 1;
    const head = this.head;
    let x = head.x + this.dx + (this.dx/3);
    let y = head.y + this.dy + (this.dy/3);
    
    if (this.world.outside(x, y)) {
      return false;            
    }
    this.pieces.push(new PlayerPiece(x, y));
    this.shrink();
    if (this.boosted == 3) {
      this.boosted = 0;
      this.pieces.forEach(piece => {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
      })
      return this.grow();
    }
    return true;
  }

  /**
   * Deletes the tail.
   */
  shrink() {
    this.pieces.shift();
  }

  /**
   * Returns the head.
   */
  get head() {
    return this.pieces[this.pieces.length - 1];
  }

  /**
   * @param {string} direction 'up', 'right', 'down', 'left'
   */
  setDirection(direction) {
    if (
      direction === 'up' && this.direction === 'down' ||
      direction === 'right' && this.direction === 'left' ||
      direction === 'down' && this.direction === 'up' ||
      direction === 'left' && this.direction === 'right'
    ) {
      return;
    }
    if (this.notBoosted()) this.nextDirection = direction;
  }

  serialize() {
    return {
      id: this.id,
      pieces: this.pieces.map(piece => piece.serialize())
    };
  }
}

module.exports = Player;

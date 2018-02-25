
class playerPiece {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * Whether or not this piece is colliding with another piece.
   * 
   * @param {PlayerPiece} playerPiece 
   */
  isCollidingWith(playerPiece) {
    return this !== playerPiece &&
      this.x === playerPiece.x &&
      this.y === playerPiece.y
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
    }
  }
}

module.exports = playerPiece

export default class Camera {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get left() {
    return this.x - innerWidth / 2;
  }

  get top() {
    return this.y - innerHeight / 2;
  }

  get right() {
    return this.x + innerWidth / 2;
  }

  get bottom() {
    return this.y + innerHeight / 2;
  }

  inViewport(x, y, width = 1, height = 1) {
    return x + width - this.left >= 0
      && y + height - this.top >= 0
      && x - this.left <= innerWidth
      && y - this.top <= innerHeight
  }
}

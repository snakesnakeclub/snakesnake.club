import { EventEmitter } from 'events';

/**
 * Emits 'direction' with 'up', 'down', 'left', or 'right' when the user wants
 * to change direction.
 */
export default class GameControlsService extends EventEmitter {
  private touch: {
    id: number,
    startX: number,
    startY: number,
  }

  constructor() {
    super();
    this.attach = this.attach.bind(this);
    this.detach = this.detach.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.touch = null;
  }

  public attach(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  public detach(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();

    if (!this.touch) {
      const touch = event.changedTouches[0];
      this.touch = {
        id: touch.identifier,
        startX: touch.pageX,
        startY: touch.pageY,
      };
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();

    if (this.touch) {
      const touch = Array.from(event.changedTouches)
        .find(touch => touch.identifier == this.touch.id);

      const startX = this.touch.startX;
      const startY = this.touch.startY;
      const endX = touch.pageX;
      const endY = touch.pageY;
      
      if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
        // Horizontal
        if (endX > startX) {
          this.emit('direction', 'right');
        } else {
          this.emit('direction', 'left');
        }
      } else {
        // Vertical
        if (endY > startY) {
          this.emit('direction', 'down');
        } else {
          this.emit('direction', 'up');
        }
      }
    }

    this.touch = null;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 87: // W
      case 38: // Up
        this.emit('direction', 'up');
        break;

      case 68: // D
      case 39: // Right
        this.emit('direction', 'right');
        break;

      case 83: // S
      case 40: // Down
        this.emit('direction', 'down');
        break;

      case 65: // A
      case 37: // Left
        this.emit('direction', 'left');
        break;
    }
  }
}

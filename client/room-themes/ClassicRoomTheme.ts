import RoomTheme from './RoomTheme';
import Skin from '../models/Skin';

export default class ClassicRoomTheme extends RoomTheme {
  public paintBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // White Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Black Stars
    let seed = 1;
    function random() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }
    
    ctx.fillStyle = 'black';
    Array.from(Array(Math.floor(canvas.width * canvas.height * 0.00125)))
      .map(() => [
        Math.floor(random() * canvas.width),
        Math.floor(random() * canvas.height),
        Math.ceil(random() * 3)
      ])
      .forEach(([ x, y, size ]) => {
        ctx.fillRect(x, y, size, size);
      })
  }

  paintTile(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, tileSize, tileSize);
  }

  paintReward(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number) {
    ctx.fillStyle = 'red';
    ctx.fillRect(
      x,
      y,
      tileSize,
      tileSize
    );
  }

  paintPlayerPiece(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, isHead: boolean, tileSize: number, skin: Skin) {
    super.paintPlayerPiece(canvas, ctx, x, y, angle, isHead, tileSize, skin);
  }
}

import Skin from '../models/Skin';

export default abstract class RoomTheme {
  abstract paintBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
  
  abstract paintTile(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;

  abstract paintReward(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;

  paintPlayerPiece(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number, skin: Skin): void {
    ctx.drawImage(
      skin.bodyImage,
      x,
      y,
      tileSize,
      tileSize
    );
  }
}

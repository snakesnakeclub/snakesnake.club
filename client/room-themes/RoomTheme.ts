import Skin from '../models/Skin';

export default abstract class RoomTheme {
  abstract paintBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
  
  abstract paintTile(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;

  abstract paintRewardGrowRespawn(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;
  
  abstract paintRewardGrow(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;
  
  abstract paintRewardTakedown(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;

  paintPlayerPiece(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, isHead: boolean, tileSize: number, skin: Skin): void {
    ctx.save(); 
    
	  // Translate co-ordinate system to the middle of where we want to draw
    ctx.translate(x + tileSize / 2, y + tileSize / 2);
    
    // Rotate around that point
    ctx.rotate(angle);

    ctx.drawImage(
      isHead ? skin.headImage : skin.bodyImage,
      -tileSize / 2,
      -tileSize / 2,
      tileSize,
      tileSize
    );
    
    ctx.restore(); 
  }
}

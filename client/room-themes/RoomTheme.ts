export default interface RoomTheme {
  paintBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
  
  paintTile(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;

  paintReward(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number): void;

  paintPlayerPiece(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number, skin: string): void;
}

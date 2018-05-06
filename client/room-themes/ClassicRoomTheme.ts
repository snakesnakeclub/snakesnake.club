import RoomTheme from './RoomTheme';
import Skin from '../models/Skin';

export default class ClassicRoomTheme extends RoomTheme {
  public static readonly id: string = 'classic';
  private tileImage;
  private rewardGrowRespawnImage;
  private rewardGrowImage;
  private rewardTakedownImage;

  constructor() {
    super();
    this.tileImage = new Image(512, 512);
    this.tileImage.src = '/static/assets/rooms/classic/tile.png';
    this.rewardGrowRespawnImage = new Image(512, 512);
    this.rewardGrowRespawnImage.src = '/static/assets/rooms/classic/rewards/grow-respawn.png';
    this.rewardGrowImage = new Image(512, 512);
    this.rewardGrowImage.src = '/static/assets/rooms/classic/rewards/grow.png';
    this.rewardTakedownImage = new Image(512, 512);
    this.rewardTakedownImage.src = '/static/assets/rooms/classic/rewards/takedown.png';
  }
  
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
    ctx.drawImage(this.tileImage, x, y, tileSize, tileSize);
  }

  paintRewardGrowRespawn(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number) {
    ctx.drawImage(this.rewardGrowRespawnImage, x, y, tileSize, tileSize);
  }

  paintRewardGrow(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number) {
    ctx.drawImage(this.rewardGrowImage, x, y, tileSize, tileSize);
  }

  paintRewardTakedown(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, tileSize: number) {
    ctx.drawImage(this.rewardTakedownImage, x, y, tileSize, tileSize);
  }

  paintPlayerPiece(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, isHead: boolean, tileSize: number, skin: Skin) {
    super.paintPlayerPiece(canvas, ctx, x, y, angle, isHead, tileSize, skin);
  }
}

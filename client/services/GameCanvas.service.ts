import Player from '../models/Player';
import Camera from '../models/Camera';
import ClassicRoomTheme from '../room-themes/ClassicRoomTheme';
import RoomTheme from '../room-themes/RoomTheme';

const TILE_SIZE = 32;
const TICK_SPEED = 1000 / 7;

export default class GameCanvasService {
  protected animationFrameId: number = null;
  protected lastFrameTime: number = null;
  protected lastTickTime: number = null;
  protected myPlayer: Player = null;
  protected players: Array<Player> = null;
  protected rewards: Array<any> = null;
  protected world: any = null;
  protected direction: string = null;
  protected theme: RoomTheme = null;

  public startDrawing(canvas: HTMLCanvasElement) {
    this.theme = new ClassicRoomTheme();
    this.endPaint(canvas, canvas.getContext('2d'));
  }

  public stopDrawing() {
    cancelAnimationFrame(this.animationFrameId);
  }

  public setTickData(playerId, { players, rewards }) {
    this.lastTickTime = Date.now();
    this.players = players.map(player => new Player({
      ...player,
      skin: '_yellow',
    }));
    this.rewards = rewards;
    this.myPlayer = this.players.find(p => p.id == playerId);
    if (this.myPlayer) {
      this.myPlayer.skin = '_green';
    }
  }

  public setWorld(world) {
    this.world = world;
  }

  public setDirection(direction) {
    this.direction = direction;
  }

  private get directionDx() {
    return {
      right: 1,
      left: -1,
      up: 0,
      down: 0,
    }[this.direction]
  }

  private get directionDy() {
    return {
      right: 0,
      left: 0,
      up: -1,
      down: 1,
    }[this.direction]
  }

  private camera(tickDt: number) {
    if (this.myPlayer) {
      const tickP = tickDt / TICK_SPEED;
      return new Camera(
        (this.myPlayer.head.x + tickP * this.directionDx) * TILE_SIZE,
        (this.myPlayer.head.y + tickP * this.directionDy) * TILE_SIZE
      )
    } else {
      return new Camera(
        Math.floor(this.world.width / 2) * TILE_SIZE,
        Math.floor(this.world.height / 2) * TILE_SIZE
      )
    }
  }

  /**
   * Calls #paint with the time since last paint and time since last tick.
   * 
   * Calls #endPaint after #paint is completed.
   */
  public startPaint(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): void {
    const now = Date.now();
    this.paint(canvas, ctx, now - this.lastFrameTime, now - this.lastTickTime);
    this.endPaint(canvas, ctx);
  }

  /**
   * @param canvas 
   * @param ctx 
   * @param paintDt time since last paint in ms
   * @param tickDt time since last tick in ms
   */
  protected paint(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    paintDt: number,
    tickDt: number
  ) {
    this.theme.paintBackground(canvas, ctx);

    if (!this.world) {
      return;
    }

    const camera = this.camera(tickDt);
    
    const cameraOffsetX = canvas.width / 2 - camera.x;
    const cameraOffsetY = canvas.height / 2 - camera.y;

    // Board
    for (let y = 0; y < this.world.height; y++) {
      for (let x = 0; x < this.world.width; x++) {
        const tileX = x * TILE_SIZE;
        const tileY = y * TILE_SIZE;
        if (camera.inViewport(tileX, tileY, TILE_SIZE, TILE_SIZE)) {
          this.theme.paintTile(canvas, ctx,
            Math.floor(tileX + cameraOffsetX),
            Math.floor(tileY + cameraOffsetY),
            TILE_SIZE);
        }
      }
    }

    if (this.rewards) {
      this.rewards.forEach((reward) => {
        this.theme.paintReward(canvas, ctx,
          Math.floor(reward.x * TILE_SIZE + cameraOffsetX),
          Math.floor(reward.y * TILE_SIZE + cameraOffsetY),
          TILE_SIZE
        );
      })
    }

    if (this.players) {
      this.players.forEach((player) => {
        player.pieces.forEach((piece) => {
          this.theme.paintPlayerPiece(canvas, ctx,
            Math.floor(piece.x * TILE_SIZE + cameraOffsetX),
            Math.floor(piece.y * TILE_SIZE + cameraOffsetY),
            TILE_SIZE,
            player.skin
          );
        })
      })
    }
  }

  /**
   * Logs current time in lastFrameTime and schedules next animation frame.
   */
  public endPaint(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    this.lastFrameTime = Date.now();
    this.animationFrameId = requestAnimationFrame(this.startPaint.bind(this, canvas, ctx));
  }
}

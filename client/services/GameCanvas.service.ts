import Player, {PlayerPiece} from '../models/Player';
import Camera from '../models/Camera';
import ClassicRoomTheme from '../room-themes/ClassicRoomTheme';
import RoomTheme from '../room-themes/RoomTheme';
import Skin from '../models/Skin';

const TILE_SIZE = 32;
const TICK_SPEED = 1000 / 7;

interface PreviousPlayers {
  [playerId: string]: Player
}

export default class GameCanvasService {
  protected animationFrameId: number;
  protected lastFrameTime: number;
  protected lastTickTime: number;
  protected myPlayer: Player;
  protected myPlayerHeadLastTick: PlayerPiece;
  protected players: Array<Player>;
  protected previousPlayers: PreviousPlayers;
  protected rewards: Array<any>;
  protected world: any;
  protected theme: RoomTheme;

  public startDrawing(canvas: HTMLCanvasElement) {
    this.theme = new ClassicRoomTheme();
    this.endPaint(canvas, canvas.getContext('2d'));
  }

  public stopDrawing() {
    cancelAnimationFrame(this.animationFrameId);
  }

  public setTickData(playerId, { players, rewards }) {
    this.lastTickTime = Date.now();
    if (this.players) {
      this.previousPlayers = {};
      this.players.forEach((player) => {
        this.previousPlayers[player.id] = player;
      })
    }
    this.players = players.map(player => new Player(player));
    this.rewards = rewards;
    this.myPlayerHeadLastTick = this.myPlayer && this.myPlayer.head;
    this.myPlayer = this.players.find(p => p.id == playerId);
    if (this.myPlayer) {
      this.myPlayerHeadLastTick = this.myPlayerHeadLastTick || this.myPlayer.head;
    }
  }

  public setWorld(world) {
    this.world = world;
  }

  private camera(tickDt: number) {
    if (this.myPlayer) {
      const tickP = tickDt / TICK_SPEED;
      const directionDx = this.myPlayer.head.x - this.myPlayerHeadLastTick.x;
      const directionDy = this.myPlayer.head.y - this.myPlayerHeadLastTick.y;
      return new Camera(
        (this.myPlayerHeadLastTick.x + tickP * directionDx) * TILE_SIZE,
        (this.myPlayerHeadLastTick.y + tickP * directionDy) * TILE_SIZE
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

    // Rewards
    if (this.rewards) {
      this.rewards.forEach((reward) => {
        this.theme.paintReward(canvas, ctx,
          Math.floor(reward.x * TILE_SIZE + cameraOffsetX),
          Math.floor(reward.y * TILE_SIZE + cameraOffsetY),
          TILE_SIZE
        );
      })
    }

    // Players
    if (this.players) {
      this.players.forEach((player) => {
        const prevPlayer = this.previousPlayers && this.previousPlayers[player.id];
        // If player is not new
        if (prevPlayer) {
          // Paint them with interpolation for head and tail
          const dt: number = tickDt / TICK_SPEED;
          const isGrowing = player.tail.x === prevPlayer.tail.x
            && player.tail.y === prevPlayer.tail.y;
          if (isGrowing) {
            this.players.slice(0, -1).forEach((player) => {
              player.pieces.forEach((piece) => {
                this.theme.paintPlayerPiece(canvas, ctx,
                  Math.floor(piece.x * TILE_SIZE + cameraOffsetX),
                  Math.floor(piece.y * TILE_SIZE + cameraOffsetY),
                  TILE_SIZE,
                  player.skin
                );
              });
            });
            const dx: number = player.head.x - prevPlayer.head.x; 
            const dy: number = player.head.y - prevPlayer.head.y;
            this.theme.paintPlayerPiece(canvas, ctx,
              Math.floor(player.head.x * TILE_SIZE + dx * dt * TILE_SIZE + cameraOffsetX),
              Math.floor(player.head.y * TILE_SIZE + dy * dt * TILE_SIZE + cameraOffsetY),
              TILE_SIZE,
              player.skin
            );
          } else {
            player.pieces.forEach((piece, i) => {
              const prevPiece = prevPlayer.pieces[i];
              const dx: number = piece.x - prevPiece.x;
              const dy: number = piece.y - prevPiece.y;
              this.theme.paintPlayerPiece(canvas, ctx,
                Math.floor(prevPiece.x * TILE_SIZE + dx * dt * TILE_SIZE + cameraOffsetX),
                Math.floor(prevPiece.y * TILE_SIZE + dy * dt * TILE_SIZE + cameraOffsetY),
                TILE_SIZE,
                player.skin
              );
            });
          }
        } else {
          // Paint them without interpolation
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

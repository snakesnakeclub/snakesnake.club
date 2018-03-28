
export default class GameCanvasService {
  protected animationFrameId: number = null;
  protected lastFrameTime: number = null;
  protected lastTickTime: number = null;
  protected currentPlayer: any = null;
  protected players: Array<any> = null;
  protected rewards: Array<any> = null;
  protected world: any = null;

  public setTickData(playerId, { players, rewards }) {
    this.lastTickTime = Date.now();
    this.players = players;
    this.rewards = rewards;
    this.currentPlayer = players.find(p => p.id == playerId);
  }

  public setWorld(world) {
    this.world = world;
  }

  /**
   * Calls #paint with the time since last paint and time since last tick.
   * 
   * Calls #endPaint after #paint is completed.
   */
  public startPaint(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    const now = Date.now();
    this.paint(canvas, ctx, now - this.lastFrameTime, now - this.lastTickTime);
    this.endPaint(canvas, ctx);
  }

  /**
   * @param paintDt time since last paint in ms
   * @param tickDt time since last tick in ms
   */
  protected paint(canvas: HTMLCanvasElement, ctxx: CanvasRenderingContext2D,
    paintDt: number, tickDt: number
  ) {
    const ctx = canvas.getContext('2d');
    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let seed = 1;
    // Background - Stars
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

    if (this.world) {
      // console.log(this.world)
      // Board
      Array.from(Array(this.world.height)).forEach((_, y) => {
        Array.from(Array(this.world.width)).forEach((__, x) => {
          ctx.fillStyle = 'black';
          ctx.fillRect(x * 16, y * 16, 16, 16);
        })
      })

    }

    if (this.rewards) {
      this.rewards.forEach((reward) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(reward.x * 16, reward.y * 16, 16, 16);
      })
    }

    if (this.players) {
      this.players.forEach((player) => {
        if (this.currentPlayer && player.id === this.currentPlayer.id) {
          ctx.fillStyle = 'green';
        } else {
          ctx.fillStyle = 'yellow';
        }
        player.pieces.forEach((piece) => {
          ctx.fillRect(piece.x * 16, piece.y * 16, 16, 16);
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

  public startDrawing(canvas: HTMLCanvasElement) {
    this.endPaint(canvas, canvas.getContext('2d'));
  }

  public stopDrawing() {
    cancelAnimationFrame(this.animationFrameId);
  }
}

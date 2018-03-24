import { EventEmitter } from 'events';

export default class Game extends EventEmitter {
  private canvas: HTMLCanvasElement = null;
  private socket: SocketIOClient.Socket = null;

  constructor(socket: SocketIOClient.Socket) {
    super();
    this.socket = socket;
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

  }

  paint() {

  }
}

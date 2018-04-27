import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import AuthService from './Auth.service';
import SocketServerService from './SocketServer.service';
import GameCanvasService from './GameCanvas.service';
import GameControlsService from './GameControls.service';
import Room from '../models/Room';
import { request } from 'https';

const TICK_SPEED = 1000 / 7;

export default class Game extends EventEmitter {
  private canvas: HTMLCanvasElement = null;
  private gameCanvasService: GameCanvasService = null;
  private gameControlsService: GameControlsService = null;
  private authService: AuthService = null;
  private socketService: SocketServerService = null;
  private rooms: Array<Room> = [];
  private direction: string = null;

  constructor() {
    super();
    this.gameCanvasService = new GameCanvasService();
    this.gameControlsService = new GameControlsService();
    this.gameControlsService.on('direction', this.handleChangeDirection.bind(this));
    this.handleRoomTick = this.handleRoomTick.bind(this);
    this.handleDeath = this.handleDeath.bind(this);
  }

  public initialize(authService: AuthService, socketService: SocketServerService) {
    this.authService = authService;
    this.socketService = socketService;
    this.fetchRooms();
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    if (canvas) {
      this.canvas = canvas;
      this.gameCanvasService.startDrawing(this.canvas);
    } else {
      this.gameCanvasService.stopDrawing();
      this.canvas = null;
    }
  }

  public get isRunning() {
    return this.canvas !== null;
  }

  public joinRoom(roomId: number) {
    return new Promise((resolve, reject) => {
      this.socketService.socket.emit('joinRoom', roomId, this.authService.user.session_token);
      this.socketService.socket.once('joinRoom->res', (err) => {
        if (err) {
          switch (err) {
            case 'ROOM_FULL':
              this.handleRoomFull();
              break;
              
            default:
              console.error(err);
          }
          return
        }
        this.socketService.socket.on('room-tick', this.handleRoomTick);
        this.socketService.socket.on('death', this.handleDeath);
        this.emit('joinRoom');
        resolve();
      })
    })
  }

  public leaveRoom() {
    this.socketService.socket.emit('leaveRoom');
    this.socketService.socket.removeEventListener('room-tick', this.handleRoomTick);
    this.socketService.socket.removeEventListener('death', this.handleDeath);
    this.emit('leaveRoom')
  }

  public spawn() {
    this.socketService.socket.emit('spawn');
    this.gameControlsService.attach();
  }

  public handleDeath() {
    this.emit('death');
    this.gameControlsService.detach();
  }

  private handleRoomTick(data) {
    this.gameCanvasService.setTickData(this.socketService.socket.id, data);
    this.gameCanvasService.setWorld(data.world);
  }

  private handleChangeDirection(direction) {
    if (this.direction !== direction) {
      this.direction == direction;
      this.socketService.socket.emit('setDirection', direction);
    }
  }

  private handleRoomFull() {
    this.emit('roomFull');
  }

  get freeRoomId() {
    const freeRoom = this.rooms.find(room => room.fee === 0);
    return freeRoom.id
  }

  public fetchRooms() {
    this.socketService.socket.emit('getRooms');
    this.socketService.socket.once('getRooms->res', (rooms) => {
      this.rooms = rooms.map(room => new Room(room));
    });
  }
}

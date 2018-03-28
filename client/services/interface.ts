import AuthService from './Auth.service';
import MinerService from './Miner.service';
import SocketServerService from './SocketServer.service';
import GameService from './Game.service';

export default interface ServicesInterface {
  authService: AuthService;
  minerService: MinerService;
  socketService: SocketServerService;
  gameService: GameService;
};

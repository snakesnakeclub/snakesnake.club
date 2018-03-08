import io from 'socket.io-client';
import BABYLON from 'babylonjs';
import {SOCKET_SERVER, SOCKET_SERVER_PATH} from './credentials.js';
import createScene from './scenes';
import MinerController from './miner';

const game = {
  // socket.io-client#Socket
  socket: io(SOCKET_SERVER, { path: SOCKET_SERVER_PATH }),
  // HTMLCanvasElement
  canvas: document.getElementById('game-canvas'),
  // HTMLDivElement
  overlay: document.getElementById('game-overlay'),
  /**
   * Disposes of the current active scene and creates the given scene.
   * 
   * @param {string} scene key from #createScene object
   */
  setActiveScene(scene) {
    if (game.scene) {
      game.scene.dispose()
      while (game.overlay.firstChild) {
        game.overlay.removeChild(game.overlay.firstChild);
      }
    }
    game.scene = createScene[scene](game)
  },
  startSession(user) {
    game.user = user;
  }
};

// babylonjs#Engine
game.engine = new BABYLON.Engine(game.canvas, true);
// babylonjs#Scene
game.scene = null;
// MinerController
game.minerController = new MinerController({ socket: game.socket });

/*
User {
  email: string
  username: string
  balance: number
  takedowns: number
  session_token: string
}
*/
game.user = null
/*
Room {
  id: string
  fee: number
  world: {
    width: number
    height: number
  }
}
*/
game.room = null;

game.setActiveScene('authenticate');

game.engine.runRenderLoop(() => {
  game.scene.render();
});

window.addEventListener('resize', () => game.engine.resize());

import io from 'socket.io-client';
import BABYLON from 'babylonjs';
import localforage from 'localforage';
import {SOCKET_SERVER, SOCKET_SERVER_PATH} from './credentials.js';
import createScene from './scenes';
import MinerController from './miner';

localforage.config({
  name: 'snakesnake',
});

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
      game.scene = null
    }
    while (game.overlay.firstChild) {
      game.overlay.removeChild(game.overlay.firstChild);
    }
    createScene[scene](game)
  },
  startSession(user) {
    game.user = user;
    localforage.setItem('session_token', user.session_token)
      .catch(console.error.bind(null, 'localforage', 'session_token'));
    game.setActiveScene('lobby');
  },
  endSession() {
    localforage.setItem('session_token', null)
      .catch(console.error.bind(null, 'localforage', 'session_token'));
    game.setActiveScene('authenticate');
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

const session_token = localforage.getItem('session_token')
  .then(session_token => {
    if (session_token) {
      game.socket.emit('login-token', session_token);
      game.socket.once('login-token->res', (err, user) => {
        if (err) {
          game.endSession();
          return alert({
            INVALID_TOKEN: 'Invalid session token.',
            '500': 'Internal error has occurred',
          }[err]);
        }
        game.startSession(user);
      })
    } else {
      game.setActiveScene('authenticate');
    }
  });

game.engine.runRenderLoop(() => {
  if (game.scene) game.scene.render();
});

window.addEventListener('resize', () => game.engine.resize());

import io from 'socket.io-client';
import BABYLON from 'babylonjs';
import {SOCKET_SERVER, SOCKET_SERVER_PATH} from './credentials.js';
import createSceneAuthenticate from './scene-authenticate';
import createSceneLogin from './scene-login';
import createSceneRegister from './scene-register';
import createSceneLobby from './scene-lobby';
import createSceneGame from './scene-game';
import MinerController from './mining/miner-controller';

const socket = io(SOCKET_SERVER, { path: SOCKET_SERVER_PATH });

new MinerController({ socket });

const game = {
  socket,
  canvas: document.getElementById('canvas'),
  engine: new BABYLON.Engine(canvas, true),
  activeScene: 'authenticate',
  setActiveScene(activeScene, {advancedTexture, scene}) {
    game.activeScene = activeScene;
    game.sceneInitialized = false;
  },
  disposeAllScenes() {
    if (game.scenes.authenticate) {
      game.scenes.authenticate = game.scenes.authenticate.dispose();
    }
    if (game.scenes.login) {
      game.scenes.login = game.scenes.login.dispose();
    }
    if (game.scenes.register) {
      game.scenes.register = game.scenes.register.dispose();
    }
    if (game.scenes.lobby) {
      game.scenes.lobby = game.scenes.lobby.dispose();
    }
    if (game.scenes.game) {
      game.scenes.game = game.scenes.game.dispose();
    }
  },
  sceneInitialized: false,
  room: {}
};

game.scenes = {
  authenticate: null,
  login: null,
  register: null,
  lobby: null,
  game: null
};

game.engine.runRenderLoop(() => {
  if (game.sceneInitialized === false) {
    game.disposeAllScenes();
    if (game.activeScene === 'authenticate') {
      game.scenes.authenticate = createSceneAuthenticate(game);
    } else if (game.activeScene === 'login') {
      game.scenes.login = createSceneLogin(game);
    } else if (game.activeScene === 'register') {
      game.scenes.register = createSceneRegister(game);
    } else if (game.activeScene === 'lobby') {
      game.scenes.lobby = createSceneLobby(game);
    } else if (game.activeScene === 'game') {
      game.scenes.game = createSceneGame(game);
    }
    game.sceneInitialized = true;
  }

  game.scenes[game.activeScene].render();
});
window.addEventListener('resize', () => game.engine.resize());

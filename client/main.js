import io from 'socket.io-client';
import BABYLON from 'babylonjs';
import createSceneAuthenticate from './scene-authenticate';
import createSceneLogin from './scene-login';
import createSceneRegister from './scene-register';
import createSceneLobby from './scene-lobby';
import createSceneGame from './scene-game';

const game = {
	socket: io(),
	canvas: document.getElementById('canvas'),
	engine: new BABYLON.Engine(canvas, true),
	activeScene: 'authenticate',
  sceneHistory: [],
  room: {}
};

const handle500 = () => {
  alert("Something went wrong, please try again.");
}
game.scenes = {
	authenticate: createSceneAuthenticate(game),
	login: createSceneLogin(game),
	register: createSceneRegister(game),
	lobby: createSceneLobby(game),
	game: createSceneGame(game),
};

game.engine.runRenderLoop(() => game.scenes[game.activeScene].render());
window.addEventListener('resize', () => game.engine.resize());

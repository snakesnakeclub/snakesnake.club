import io from 'socket.io-client';
import BABYLON from 'babylonjs';
import createSceneAuthenticate from './scene-authenticate';
import createSceneLogin from './scene-login';
import createSceneRegister from './scene-register';
import createSceneLobby from './scene-lobby';

const game = {
	socket: io(),
	canvas: document.getElementById('canvas'),
	engine: new BABYLON.Engine(canvas, true),
	activeScene: 'lobby',
	sceneHistory: []
};

game.scenes = {
	authenticate: createSceneAuthenticate(game),
	login: createSceneLogin(game),
	register: createSceneRegister(game),
	lobby: createSceneLobby(game),
};

game.engine.runRenderLoop(() => game.scenes[game.activeScene].render());
window.addEventListener('resize', () => game.engine.resize());

import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  const btnLogin = BABYLON.GUI.Button.CreateSimpleButton('btnLogin', 'LOGIN');
  btnLogin.width = '180px';
  btnLogin.height = '40px';
  btnLogin.top = -25;
  btnLogin.fontFamily = 'Patua One';
  btnLogin.color = 'white';
  btnLogin.background = 'indigo';
  btnLogin.onPointerUpObservable.add(() => {
    game.sceneHistory.push(game.activeScene);
    game.activeScene = 'login';
  });

  const btnRegister = BABYLON.GUI.Button.CreateSimpleButton('btnRegister', 'REGISTER');
  btnRegister.width = '180px';
  btnRegister.height = '40px';
  btnRegister.top = 25;
  btnRegister.fontFamily = 'Patua One';
  btnRegister.color = 'white';
  btnRegister.background = 'indigo';
  btnRegister.onPointerUpObservable.add(() => {
    game.sceneHistory.push(game.activeScene);
    game.activeScene = 'register';
  });

  advancedTexture.addControl(btnLogin);
  advancedTexture.addControl(btnRegister);

  return scene;
};

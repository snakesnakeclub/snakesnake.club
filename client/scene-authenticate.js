import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import logoUrl from './assets/logo.png';

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  const panel = new BABYLON.GUI.StackPanel();
  advancedTexture.addControl(panel);

  const imgLogo = new BABYLON.GUI.Image('imgLogo', logoUrl);
  imgLogo.width = '300px';
  imgLogo.height = '150px';
  panel.addControl(imgLogo);
  // ImgLogo.left = "-50px";

  const btnLogin = BABYLON.GUI.Button.CreateSimpleButton('btnLogin', 'LOGIN');
  btnLogin.width = '240px';
  btnLogin.height = '44px';
  btnLogin.fontFamily = 'Patua One';
  btnLogin.color = 'white';
  btnLogin.background = 'indigo';
  btnLogin.paddingTop = '7px';
  btnLogin.paddingBottom = '7px';
  btnLogin.onPointerUpObservable.add(() => {
    game.sceneHistory.push(game.activeScene);
    game.activeScene = 'login';
    advancedTexture.dispose();
  });
  panel.addControl(btnLogin);

  const btnRegister = BABYLON.GUI.Button.CreateSimpleButton('btnRegister', 'REGISTER');
  btnRegister.width = '240px';
  btnRegister.height = '44px';
  btnRegister.fontFamily = 'Patua One';
  btnRegister.color = 'white';
  btnRegister.background = 'indigo';
  btnRegister.paddingTop = '7px';
  btnRegister.paddingBottom = '7px';
  btnRegister.onPointerUpObservable.add(() => {
    game.sceneHistory.push(game.activeScene);
    game.activeScene = 'register';
    advancedTexture.dispose();
  });
  panel.addControl(btnRegister);

  return scene;
};

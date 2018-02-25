import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  // GUI
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  const panel = new BABYLON.GUI.StackPanel();

  const inputEmail = new BABYLON.GUI.InputText();
  inputEmail.width = '240px';
  inputEmail.maxWidth = '240px';
  inputEmail.height = '44px';
  inputEmail.text = '';
  inputEmail.placeholderText = 'Email';
  inputEmail.fontFamily = 'Patua One';
  inputEmail.color = 'indigo';
  inputEmail.background = 'white';
  inputEmail.focusedBackground = 'white';
  inputEmail.paddingTop = '7px';
  inputEmail.paddingBottom = '7px';
  panel.addControl(inputEmail);

  const inputPassword = new BABYLON.GUI.InputText();
  inputPassword.width = '240px';
  inputPassword.maxWidth = '240px';
  inputPassword.height = '44px';
  inputPassword.text = '';
  inputPassword.placeholderText = 'Password';
  inputPassword.fontFamily = 'Patua One';
  inputPassword.color = 'indigo';
  inputPassword.background = 'white';
  inputPassword.focusedBackground = 'white';
  inputPassword.paddingTop = '7px';
  inputPassword.paddingBottom = '7px';
  let password = "";
  inputPassword.onTextChangedObservable.add(function() {
    password = password + inputPassword.text.charAt(password.length);
    inputPassword.text = "*".repeat(password.length);
  });
  panel.addControl(inputPassword);


  const btnLogin = BABYLON.GUI.Button.CreateSimpleButton('btnLogin', 'LOGIN');
  btnLogin.width = '240px';
  btnLogin.maxWidth = '240px';
  btnLogin.height = '44px';
  btnLogin.fontFamily = 'Patua One';
  btnLogin.color = 'white';
  btnLogin.background = 'indigo';
  btnLogin.paddingTop = '7px';
  btnLogin.paddingBottom = '7px';
  panel.addControl(btnLogin);

  const btnRegister = BABYLON.GUI.Button.CreateSimpleButton('btnRegister', 'don\'t have an account?');
  btnRegister.width = '240px';
  btnRegister.maxWidth = '240px';
  btnRegister.height = '44px';
  btnRegister.fontFamily = 'Patua One';
  btnRegister.color = 'white';
  btnRegister.background = '#33344B';
  btnRegister.paddingTop = '15px';
  btnRegister.thickness = 0;
  btnRegister.onPointerUpObservable.add(() => {
    game.sceneHistory.push(game.activeScene);
    game.activeScene = 'register';
    scene.setVisible = false;
  });
  panel.addControl(btnRegister);

  const btnResetPassword = BABYLON.GUI.Button.CreateSimpleButton('btnResetPassword', 'reset password');
  btnResetPassword.fontSize = '15rem';
  btnResetPassword.width = '240px';
  btnResetPassword.maxWidth = '240px';
  btnResetPassword.height = '44px';
  btnResetPassword.fontFamily = 'Patua One';
  btnResetPassword.color = 'white';
  btnResetPassword.background = '#33344B';
  btnResetPassword.paddingTop = '15px';
  btnResetPassword.thickness = 0;
  btnResetPassword.onPointerUpObservable.add(() => {
    alert("reset password email sent!");
  });
  panel.addControl(btnResetPassword);

  advancedTexture.addControl(panel);

  return scene;
};

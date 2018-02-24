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
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var panel = new BABYLON.GUI.StackPanel();

  var inputEmail = new BABYLON.GUI.InputText();
  inputEmail.width = 0.5;
  inputEmail.maxWidth = 0.5;
  inputEmail.height = '40px';
  inputEmail.text = '';
  inputEmail.placeholderText = 'Email';
  inputEmail.color = 'indigo';
  inputEmail.background = 'white';
  inputEmail.focusedBackground = 'white';
  panel.addControl(inputEmail);

  var inputUsername = new BABYLON.GUI.InputText();
  inputUsername.width = 0.5;
  inputUsername.maxWidth = 0.5;
  inputUsername.height = '40px';
  inputUsername.text = '';
  inputUsername.placeholderText = 'Username';
  inputUsername.color = 'indigo';
  inputUsername.background = 'white';
  inputUsername.focusedBackground = 'white';
  panel.addControl(inputUsername);


  var inputPassword = new BABYLON.GUI.InputText();
  inputPassword.width = 0.5;
  inputPassword.maxWidth = 0.5;
  inputPassword.height = '40px';
  inputPassword.text = '';
  inputPassword.placeholderText = 'Password';
  inputPassword.color = 'indigo';
  inputPassword.background = 'white';
  inputPassword.focusedBackground = 'white';
  panel.addControl(inputPassword);

  var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Register");
  button.width = .5;
  button.maxWidth = 0.2;
  button.height = "40px";
  button.color = "white";
  button.background = "indigo";
  button.topPadding = "50";
  panel.addControl(button);  

  advancedTexture.addControl(panel);

  return scene;
};

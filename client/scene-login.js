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
  advancedTexture.addControl(panel);

  var inputEmail = new BABYLON.GUI.InputText();
  inputEmail.width = 0.5;
  inputEmail.maxWidth = 0.5;
  inputEmail.height = '40px';
  inputEmail.text = '';
  inputEmail.placeholderText = 'Username';
  inputEmail.color = 'indigo';
  inputEmail.background = 'white';
  inputEmail.focusedBackground = 'white';

  var inputUsername = new BABYLON.GUI.InputText();
  inputEmail.width = 0.5;
  inputEmail.maxWidth = 0.5;
  inputEmail.height = '40px';
  inputEmail.text = '';
  inputEmail.placeholderText = 'Username';
  inputEmail.color = 'indigo';
  inputEmail.background = 'white';
  inputEmail.focusedBackground = 'white';
  inputEmail.focusedBackground = 'white';

  var inputPassword = new BABYLON.GUI.InputText();
  inputEmail.width = 0.5;
  inputEmail.maxWidth = 0.5;
  inputEmail.height = '40px';
  inputEmail.text = '';
  inputEmail.placeholderText = 'Password';
  inputEmail.color = 'indigo';
  inputEmail.background = 'white';
  inputEmail.focusedBackground = 'white';

  var inputConfirmPassword = new BABYLON.GUI.InputText();
  inputEmail.width = 0.5;
  inputEmail.maxWidth = 0.5;
  inputEmail.height = '40px';
  inputEmail.text = '';
  inputEmail.placeholderText = 'Confirm Password';
  inputEmail.color = 'indigo';
  inputEmail.background = 'white';
  inputEmail.focusedBackground = 'white';

  panel.addControl(inputEmail);
  panel.addControl(inputUsername);
  panel.addControl(inputPassword);
  panel.addControl(inputConfirmPassword);

  return scene;
};

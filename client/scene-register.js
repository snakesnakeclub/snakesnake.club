import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

module.exports = function createScene(game) {
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  var panel = new BABYLON.GUI.StackPanel();    

  var email = new BABYLON.GUI.InputText();
  email.width = '200px';
  email.height = '40px';
  email.placeholderText = 'Email';
  email.color = 'indigo';
  email.background = 'white';
  email.focusedBackground = 'white';
  email.paddingTop = '5px';
  email.paddingBottom = '5px';
  panel.addControl(email);

  var username = new BABYLON.GUI.InputText();
  username.width = '200px';
  username.height = '40px';
  username.placeholderText = 'Username';
  username.color = 'indigo';
  username.background = 'white';
  username.focusedBackground = 'white';
  username.paddingTop = '5px';
  username.paddingBottom = '5px';
  panel.addControl(username);

	var password = new BABYLON.GUI.InputText();
  password.width = '200px';
  password.height = '40px';
  password.placeholderText = 'Password';
  password.color = 'indigo';
  password.background = 'white';
  password.focusedBackground = 'white';
  password.paddingTop = '5px';
  password.paddingBottom = '5px';
  password.onTextChangedObservable.add((event) => {
    password.realText = event.text
  })
  panel.addControl(password);

  var confirmPassword = new BABYLON.GUI.InputText();
  confirmPassword.width = '200px';
  confirmPassword.height = '40px';
  confirmPassword.placeholderText = 'Confirm Password';
  confirmPassword.color = 'indigo';
  confirmPassword.background = 'white';
  confirmPassword.focusedBackground = 'white';
  confirmPassword.paddingTop = '5px';
  confirmPassword.paddingBottom = '5px';
  panel.addControl(confirmPassword); 

  var btnSubmit = BABYLON.GUI.Button.CreateSimpleButton('btnSubmit', 'Register');
  btnSubmit.width = '200px';
  btnSubmit.maxWidth = '200px';
  btnSubmit.height = '40px';
  btnSubmit.color = 'white';
  btnSubmit.background = 'indigo';
  btnSubmit.paddingTop = '5px';
  btnSubmit.paddingBottom = '5px';
  panel.addControl(btnSubmit);    

  btnSubmit.onPointerDownObservable.add(function() {
    console.log('Button pressed.');
  });

  advancedTexture.addControl(panel);  

  confirmPassword.onTextChangedObservable.add(function() {
    if (password == confirmPassword) {
      confirmPassword.background = 'Green';
      confirmPassword.color = 'orange';
    }
  })

  return scene;
};

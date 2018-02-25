import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import validator from 'validator';

module.exports = function createScene(game) {
	const scene = new BABYLON.Scene(game.engine);

	const socket = game.socket;

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  const panel = new BABYLON.GUI.StackPanel();

  const inputEmail = new BABYLON.GUI.InputText();
  inputEmail.width = '240px';
  inputEmail.height = '44px';
  inputEmail.placeholderText = 'Email';
  inputEmail.fontFamily = 'Patua One';
  inputEmail.color = 'indigo';
  inputEmail.background = 'white';
  inputEmail.focusedBackground = 'white';
  inputEmail.paddingTop = '7px';
  inputEmail.paddingBottom = '7px';
  panel.addControl(inputEmail);

  const inputUsername = new BABYLON.GUI.InputText();
  inputUsername.width = '240px';
  inputUsername.height = '44px';
  inputUsername.placeholderText = 'Username';
  inputUsername.fontFamily = 'Patua One';
  inputUsername.color = 'indigo';
  inputUsername.background = 'white';
  inputUsername.focusedBackground = 'white';
  inputUsername.paddingTop = '7px';
  inputUsername.paddingBottom = '7px';
  panel.addControl(inputUsername);

  const inputPassword = new BABYLON.GUI.InputText();
  inputPassword.width = '240px';
  inputPassword.height = '44px';
  inputPassword.placeholderText = 'Password';
  inputPassword.fontFamily = 'Patua One';
  inputPassword.color = 'indigo';
  inputPassword.background = 'white';
  inputPassword.focusedBackground = 'white';
  inputPassword.paddingTop = '7px';
  inputPassword.paddingBottom = '7px';
  panel.addControl(inputPassword);

  const inputConfirmPassword = new BABYLON.GUI.InputText();
  inputConfirmPassword.width = '240px';
  inputConfirmPassword.height = '44px';
  inputConfirmPassword.placeholderText = 'Confirm Password';
  inputConfirmPassword.fontFamily = 'Patua One';
  inputConfirmPassword.color = 'indigo';
  inputConfirmPassword.background = 'white';
  inputConfirmPassword.focusedBackground = 'white';
  inputConfirmPassword.paddingTop = '7px';
  inputConfirmPassword.paddingBottom = '7px';
  inputConfirmPassword.onTextChangedObservable.add(() => {
  	if (inputPassword.text == inputConfirmPassword.text) {
  		inputConfirmPassword.background = 'green';
  		inputConfirmPassword.color = 'orange';
  	}
  });
  panel.addControl(inputConfirmPassword);

  const btnRegister = BABYLON.GUI.Button.CreateSimpleButton('btnRegister', 'REGISTER');
  btnRegister.width = '240px';
  btnRegister.maxWidth = '240px';
  btnRegister.height = '44px';
  btnRegister.fontFamily = 'Patua One';
  btnRegister.color = 'white';
  btnRegister.background = 'indigo';
  btnRegister.paddingTop = '7px';
  btnRegister.paddingBottom = '7px';
  btnRegister.onPointerDownObservable.add(() => {
  	const email = inputEmail.text;
  	const username = inputUsername.text;
  	const password = inputPassword.text;
  	const passwordConfirmation = inputConfirmPassword.text;
  	if (passwordConfirmation === password) {
      socket.emit('register', email, username, password);
  	} else {
      alert('Passwords do not match.');
  	}
  });
  socket.on('register->res', err => {
  	if (err == 500) {
      alert('Internal error occurred. Please try again at a later time.');
      return;
  	} if (err) {
      console.log(err);
      alert({
      	// Hehehe, excused cuz we are at a hackathon :) <3 to the reader
      	USERNAME_TAKEN: 'Username is already in use.',
      	EMAIL_ALREADY_REGISTERED: 'Email is already in use.',
      	INVALID_EMAIL: 'Email field must be an email.',
      	WEAK_PASSWORD: 'Password too weak.'
      }[err]);
      return;
  	}

    alert('Registration complete! Please check your inbox to continue.');
  });

  panel.addControl(btnRegister);
  const btnLogin = BABYLON.GUI.Button.CreateSimpleButton('btnLogin', 'already have an account?');
  btnLogin.fontSize = '20rem';
  btnLogin.width = '240px';
  btnLogin.maxWidth = '240px';
  btnLogin.height = '44px';
  btnLogin.fontFamily = 'Patua One';
  btnLogin.color = 'white';
  btnLogin.background = '#33344B';
  btnLogin.paddingTop = '15px';
  btnLogin.thickness = 0;
  btnLogin.onPointerUpObservable.add(() => {
    game.sceneHistory.push(game.activeScene);
    game.activeScene = 'login';
    scene.setVisible = false;
  });
  panel.addControl(btnLogin);

  const resendEmail = BABYLON.GUI.Button.CreateSimpleButton('resendEmail', 'resend email confirmation');
  resendEmail.fontSize = '15rem';
  resendEmail.width = '240px';
  resendEmail.maxWidth = '240px';
  resendEmail.height = '44px';
  resendEmail.fontFamily = 'Patua One';
  resendEmail.color = 'white';
  resendEmail.background = '#33344B';
  resendEmail.paddingTop = '15px';
  resendEmail.thickness = 0;
  resendEmail.onPointerUpObservable.add(() => {
  	const email = inputEmail.text;
  	if (!email) {
      alert('Email address is required.');
      return;
  	}
  	if (!validator.isEmail(email)) {
      alert('Email address is invalid.');
      return;
  	}
    socket.emit('resend-confirmation', email);
  });
  socket.on('resend-confirmation->res', err => {
  	if (err == 500) {
      alert('Internal error occurred. Please try again at a later time.');
      return;
  	} if (err) {
      console.log(err);
      alert({
      	// Hehehe, excused cuz we are at a hackathon :) <3 to the reader
      	USER_ALREADY_VERIFIED: 'User is already verified.',
      	INVALID_EMAIL: 'Email field must be an email.'
      }[err]);
      return;
  	}

    alert('Confirmation email has been resent! Please check your inbox to continue.');
  });
  panel.addControl(resendEmail);

  advancedTexture.addControl(panel);

  return scene;
};

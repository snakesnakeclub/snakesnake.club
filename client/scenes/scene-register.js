import BABYLON from 'babylonjs';
import validator from 'validator';
import logoUrl from '../assets/logo.png';

module.exports = function createScene(game) {
  const scene = new BABYLON.Scene(game.engine);

  const socket = game.socket;

  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const imgLogo = document.createElement('img');
  imgLogo.src = logoUrl;
  imgLogo.width = 300;
  imgLogo.height = 150;
  game.overlay.appendChild(imgLogo);
  
  const inputEmail = document.createElement('input');
  inputEmail.type = 'text';
  inputEmail.placeholder = 'Email';
  game.overlay.appendChild(inputEmail);
  
  const inputUsername = document.createElement('input');
  inputUsername.type = 'text';
  inputUsername.placeholder = 'Username';
  game.overlay.appendChild(inputUsername);
  
  const inputPassword = document.createElement('input');
  inputPassword.type = 'password';
  inputPassword.placeholder = 'Password';
  game.overlay.appendChild(inputPassword);
  
  const inputConfirmPassword = document.createElement('input');
  inputConfirmPassword.type = 'password';
  inputConfirmPassword.placeholder = 'Confirm Password';
  game.overlay.appendChild(inputConfirmPassword);

  const btnRegister = document.createElement('button');
  btnRegister.innerText = 'Register'
  btnRegister.addEventListener('click', () => {
    const email = inputEmail.value;
    const username = inputUsername.value;
    const password = inputPassword.value;
    const passwordConfirmation = inputConfirmPassword.value;
    if (passwordConfirmation === password) {
      btnRegister.disabled = true;
      socket.emit('register', email, username, password);
    } else {
      alert('Passwords do not match.');
    }
  });
  socket.once('register->res', err => {
    btnRegister.disabled = false;
    if (err == 500) {
      alert('Internal error occurred. Please try again at a later time.');
      return;
    } if (err) {
      console.error(err);
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
  game.overlay.appendChild(btnRegister);

  const btnLogin = document.createElement('button');
  btnLogin.className = 'btn-frameless'
  btnLogin.innerText = 'already have an account?'
  btnLogin.addEventListener('click', () => {
    game.setActiveScene('login');
  });
  game.overlay.appendChild(btnLogin);

  const resendEmail = document.createElement('button');
  resendEmail.className = 'btn-frameless'
  resendEmail.innerText = 'resend email verification'
  resendEmail.addEventListener('click', () => {
    const email = inputEmail.value;
    if (!email) {
      alert('Email address is required.');
      return;
    }
    if (!validator.isEmail(email)) {
      alert('Email address is invalid.');
      return;
    }
    resendEmail.disabled = true;
    socket.emit('resend-verification', email);
  });
  socket.once('resend-verification->res', err => {
    resendEmail.disabled = false;
    if (err) {
      console.error(err);
      alert({
        // Hehehe, excused cuz we are at a hackathon :) <3 to the reader
        USER_ALREADY_VERIFIED: 'User is already verified.',
        INVALID_EMAIL: 'Email field must be an email.',
        500: 'Internal error occurred. Please try again at a later time.',
      }[err]);
      return;
    }
    alert('Verification email has been resent! Please check your inbox to continue.');
  });
  game.overlay.appendChild(resendEmail);

  return scene;
};

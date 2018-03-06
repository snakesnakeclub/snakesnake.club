import BABYLON from 'babylonjs';
import validator from 'validator';
import logoUrl from '../assets/logo.png';

module.exports = function createScene(game) {
  // This creates a basic Babylon Scene object (non-mesh)
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
  
  const inputPassword = document.createElement('input');
  inputPassword.type = 'password';
  inputPassword.placeholder = 'Password';
  game.overlay.appendChild(inputPassword);
  
  const btnLogin = document.createElement('button');
  btnLogin.innerText = 'Login'
  btnLogin.addEventListener('click', () => {
    const email = inputEmail.value;
    const password = inputPassword.value;
    socket.emit('login', email, password);
  });
  socket.once('login->res', (err, user) => {
    if (err) {
      return alert({
        INVALID_EMAIL: 'Email address is invalid.',
        INVALID_PASSWORD: 'Password is invalid.',
        EMAIL_NOT_VERIFIED: 'Please verify email address before you can continue.',
        '500': 'Internal error has occurred',
      }[err]);
    }
    game.startSession(user);
    game.setActiveScene('lobby');
  });
  game.overlay.appendChild(btnLogin);

  const btnRegister = document.createElement('button');
  btnRegister.className = 'btn-frameless'
  btnRegister.innerText = 'don\'t have an account?'
  btnRegister.addEventListener('click', () => {
    game.setActiveScene('register');
  });
  game.overlay.appendChild(btnRegister);

  const btnResetPassword = document.createElement('button');
  btnResetPassword.className = 'btn-frameless'
  btnResetPassword.innerText = 'reset password'
  btnResetPassword.addEventListener('click', () => {
    const email = inputEmail.text;
    if (!validator.isEmail(email)) {
      alert('Invalid email address.');
      return;
    }
    socket.emit('reset-password', email);
  });
  socket.once('reset-password->res', (err) => {
    if (err) {
      alert({
        'INVALID_EMAIL': 'Invalid email address.',
        '500': 'Internal error has occurred',
      }[err])
      return
    }
    alert('Password reset email has been sent! Please check your inbox.')
  })
  game.overlay.appendChild(btnResetPassword);

  return scene;
};

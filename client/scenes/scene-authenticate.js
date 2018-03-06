import BABYLON from 'babylonjs';
import logoUrl from '../assets/logo.png';

module.exports = function createScene(game) {
  const scene = new BABYLON.Scene(game.engine);

  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const imgLogo = document.createElement('img');
  imgLogo.src = logoUrl;
  imgLogo.width = 300;
  imgLogo.height = 150;
  game.overlay.appendChild(imgLogo);
  
  const btnLogin = document.createElement('button');
  btnLogin.innerText = 'Login'
  btnLogin.addEventListener('click', () => {
    game.setActiveScene('login');
  });
  game.overlay.appendChild(btnLogin);
  
  const btnRegister = document.createElement('button');
  btnRegister.innerText = 'Register'
  btnRegister.addEventListener('click', () => {
    game.setActiveScene('register');
  });
  game.overlay.appendChild(btnRegister);

  return scene;
};

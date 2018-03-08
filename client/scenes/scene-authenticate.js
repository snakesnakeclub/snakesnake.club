import logoUrl from '../assets/logo.png';

module.exports = function createScene(game) {
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
};

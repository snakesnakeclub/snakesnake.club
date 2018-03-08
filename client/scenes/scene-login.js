import validator from 'validator';
import logoUrl from '../assets/logo.png';

module.exports = function createScene(game) {
  const socket = game.socket;

  const imgLogo = document.createElement('img');
  imgLogo.src = logoUrl;
  imgLogo.width = 300;
  imgLogo.height = 150;
  game.overlay.appendChild(imgLogo);
  
  const formLogin = document.createElement('form');
  game.overlay.appendChild(formLogin);
  formLogin.addEventListener('submit', handleLoginClick);
  socket.once('login->res', handleLoginResponse);
  
  const inputEmail = document.createElement('input');
  inputEmail.id = 'login-email';
  inputEmail.name = 'login-email';
  inputEmail.type = 'email';
  inputEmail.required = true;
  inputEmail.autocomplete = false;
  inputEmail.placeholder = 'Email';
  formLogin.appendChild(inputEmail);
  
  const inputPassword = document.createElement('input');
  inputPassword.id = 'login-password';
  inputPassword.name = 'login-password';
  inputPassword.type = 'password';
  inputPassword.required = true;
  inputPassword.autocomplete = false;
  inputPassword.placeholder = 'Password';
  formLogin.appendChild(inputPassword);
  
  const btnLogin = document.createElement('button');
  btnLogin.type = 'submit';
  btnLogin.innerText = 'Login';
  formLogin.appendChild(btnLogin);
  
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
  btnResetPassword.addEventListener('click', (event) => {
    handleResetPasswordClick(event)
  });
  socket.once('reset-password->res', handleResetPasswordResponse)
  game.overlay.appendChild(btnResetPassword);

  function handleLoginClick(event) {
    event.preventDefault();
    const email = inputEmail.value;
    const password = inputPassword.value;
    btnLogin.disabled = true;
    socket.emit('login', email, password);
  }
  
  function handleLoginResponse(err, user) {
    btnLogin.disabled = false;
    socket.once('login->res', handleLoginResponse);
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
  }

  function handleResetPasswordClick() {
    const email = inputEmail.value;
    if (!validator.isEmail(email)) {
      alert('Invalid email address.');
      return;
    }
    btnResetPassword.disabled = true;
    socket.emit('reset-password', email);
  }

  function handleResetPasswordResponse(err) {
    btnResetPassword.disabled = false;
    socket.once('reset-password->res', handleResetPasswordResponse)
    if (err) {
      alert({
        'INVALID_EMAIL': 'Invalid email address.',
        '500': 'Internal error has occurred',
      }[err])
      return
    }
    alert('Password reset email has been sent! Please check your inbox.')
  }
};

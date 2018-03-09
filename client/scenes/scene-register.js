import validator from 'validator';
import logoUrl from '../assets/logo.png';

module.exports = function createScene(game) {
  const socket = game.socket;

  const imgLogo = document.createElement('img');
  imgLogo.src = logoUrl;
  imgLogo.width = 300;
  imgLogo.height = 150;
  game.overlay.appendChild(imgLogo);
  
  const formRegister = document.createElement('form');
  game.overlay.appendChild(formRegister);
  formRegister.addEventListener('submit', handleRegisterClick);
  
  const inputEmail = document.createElement('input');
  inputEmail.id = 'register-email';
  inputEmail.name = 'register-email';
  inputEmail.type = 'email';
  inputEmail.required = true;
  inputEmail.autocomplete = false;
  inputEmail.placeholder = 'Email';
  formRegister.appendChild(inputEmail);
  
  const inputUsername = document.createElement('input');
  inputUsername.id = 'register-username';
  inputUsername.name = 'register-username';
  inputUsername.type = 'text';
  inputUsername.required = true;
  inputUsername.autocomplete = false;
  inputUsername.placeholder = 'Username';
  formRegister.appendChild(inputUsername);
  
  const inputPassword = document.createElement('input');
  inputPassword.id = 'register-password';
  inputPassword.id = 'register-password';
  inputPassword.type = 'password';
  inputPassword.required = true;
  inputPassword.autocomplete = false;
  inputPassword.placeholder = 'Password';
  formRegister.appendChild(inputPassword);
  
  const inputConfirmPassword = document.createElement('input');
  inputConfirmPassword.id = 'register-confirm-password';
  inputConfirmPassword.name = 'register-confirm-password';
  inputConfirmPassword.type = 'password';
  inputConfirmPassword.required = true;
  inputConfirmPassword.autocomplete = false;
  inputConfirmPassword.placeholder = 'Confirm Password';
  formRegister.appendChild(inputConfirmPassword);

  const btnRegister = document.createElement('button');
  btnRegister.type = 'submit';
  btnRegister.innerText = 'Register';
  formRegister.appendChild(btnRegister);

  const btnLogin = document.createElement('button');
  btnLogin.className = 'btn-frameless'
  btnLogin.innerText = 'already have an account?'
  btnLogin.addEventListener('click', () => {
    game.setActiveScene('login');
  });
  game.overlay.appendChild(btnLogin);

  const btnResendEmail = document.createElement('button');
  btnResendEmail.className = 'btn-frameless'
  btnResendEmail.innerText = 'resend email verification'
  btnResendEmail.addEventListener('click', handleResendVerficationClick);
  game.overlay.appendChild(btnResendEmail);

  function handleRegisterClick(event) {
    event.preventDefault();
    const email = inputEmail.value;
    const username = inputUsername.value;
    const password = inputPassword.value;
    const passwordConfirmation = inputConfirmPassword.value;

    if (passwordConfirmation !== password) {
      alert('Passwords do not match.');
      return;
    }
    btnRegister.disabled = true;
    socket.emit('register', email, username, password);
    socket.once('register->res', handleRegisterResponse);
  }

  function handleRegisterResponse(err) {
    btnRegister.disabled = false;
    if (err) {
      console.error(err);
      alert({
        USERNAME_TAKEN: 'Username is already in use.',
        EMAIL_ALREADY_REGISTERED: 'Email is already in use.',
        INVALID_EMAIL: 'Email is invalid.',
        INVALID_USERNAME: 'Username is invalid.',
        WEAK_PASSWORD: 'Password too weak.',
        500: 'Internal error occurred. Please try again at a later time.'
      }[err]);
      return;
    }

    alert('Registration complete! Please check your inbox to continue.');
  }

  function handleResendVerficationClick() {
    const email = inputEmail.value;

    if (!email) {
      alert('Email address is required.');
      return;
    }
    if (!validator.isEmail(email)) {
      alert('Email address is invalid.');
      return;
    }

    btnResendEmail.disabled = true;
    socket.emit('resend-verification', email);
    socket.once('resend-verification->res', handleResendVerficationResponse);
  }

  function handleResendVerficationResponse(err) {
    btnResendEmail.disabled = false;
    if (err) {
      console.error(err);
      alert({
        USER_ALREADY_VERIFIED: 'User is already verified.',
        INVALID_EMAIL: 'Email field must be an email.',
        500: 'Internal error occurred. Please try again at a later time.',
      }[err]);
      return;
    }
    alert('Verification email has been resent! Please check your inbox to continue.');
  }
};

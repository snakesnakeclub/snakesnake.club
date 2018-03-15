const User = require('../models/user');
const owasp = require('owasp-password-strength-test');
const crypto = require('crypto');
const mail = require('./mail');
const helpers = require('./helpers');
const validator = require('validator');
const isEmailBlacklisted = require('../validation/is-email-blacklisted.js');

module.exports = {
  setSocketControllers(socket) {
    socket.on('register', async (email, username, password) => {
      const valid = await validateAndCallbackWithErrors(email, username, password,
        err => socket.emit('register->res', err));
      if (!valid) {
        // Handled by validator
        return;
      }
      const token = await helpers.randomString(30)
        .catch(err => {
          console.error(err);
          socket.emit('register->res', 500);
        });
      const userData = {
        email,
        username,
        password,
        balance: 0,
        takedowns: 0,
        verified: false,
        verification_token: token,
        session_token: null
      };
      User.create(userData, err => {
        if (err) {
          if (err.code === 11000) {
            // Handled by validator
            return;
          }
          if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors)
              .map((error) => 'INVALID_' + error.path.toUpperCase())
              socket.emit('register->res', errors[0])
            return;
          }
          console.error(err);
          socket.emit('register->res', 500);
          return;
        }
        socket.emit('register->res', false);
        mail.sendEmailVerification(email, token);
      });
    });

    socket.on('resend-verification', async email => {
      if (!validator.isEmail(email)) {
        socket.emit('resend-verification->res', 'INVALID_EMAIL');
        return;
      }

      const token = await helpers.randomString(30)
        .catch(err => {
          console.error(err);
          socket.emit('resend-verification->res', 500);
        });

      User.findOne({
        email
      }, async (err, user) => {
        if (err) {
          socket.emit('resend-verification->res', 500);
          return;
        }
        if (!user) {
          socket.emit('resend-verification->res', 'INVALID_EMAIL');
          return;
        }
        if (user.verified) {
          socket.emit('resend-verification->res', 'USER_ALREADY_VERIFIED');
          return;
        }
        socket.emit('resend-verification->res', false);
        user.verification_token = token;
        await user.save();
        mail.sendEmailVerification(email, token);
      });
    });
  },

  setRouteControllers(app) {
    app.get('/verification/:token', (req, res) => {
      const token = req.params.token;
      User.findOne({
        verification_token: token
      }, (err, user) => {
        if (err || !user) {
          res.status(400);
          res.send('USER_NOT_FOUND')
          return
        }
        
        user.verified = true,
        user.verification_token = null
        user.save()
        res.redirect('/');
      });
    });
  }
};

async function validateAndCallbackWithErrors(email, username, password, callback) {
  let isValid = true;
  if (validator.isEmail(email) && !isEmailBlacklisted(email)) {
    const isEmailRegistered = await User.findOne({email});
    if (isEmailRegistered) {
      callback('EMAIL_ALREADY_REGISTERED');
      isValid = false;
    }
  } else {
    callback('INVALID_EMAIL');
    isValid = false;
  }

  const isUsernameRegistered = await User.findOne({username});
  if (isUsernameRegistered) {
    callback('USERNAME_TAKEN');
    isValid = false;
  }

  if (!owasp.test(password).strong) {
    callback('WEAK_PASSWORD');
    isValid = false;
  }

  return isValid;
}

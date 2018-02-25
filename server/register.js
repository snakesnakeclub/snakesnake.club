const User = require('./user');
var owasp = require('owasp-password-strength-test');
var crypto = require('crypto');
var mail = require('./mail');
const helpers = require('./helpers')
const validator = require('validator')

module.exports = {
<<<<<<< HEAD
  set: function(socket) {
    socket.on('register', async function(email, username, password) {
      const valid = await validateAndCallbackWithErrors(email, username, password,
        (err) => console.log(err) || socket.emit('register->res', err)
      )
      if (valid) {
        const verification_token = await helpers.randomString(30)
          .catch(function(err) {
            console.error(err)
            socket.emit('register->res', 500);
          });
        var userData = {
          email,
          username,
          password,
          balance: 0,
          verified : false,
          verification_token,
          session_token : null,
        };
        User.create(userData, function(err) {
          if (err) {
            if (err.code === 11000) {
              // Handled by validator
              return
            }
            console.error(err)
            socket.emit('register->res', 500)
            return
=======
  
  setSocket : function(socket) {
      socket.on('register', async function(email, username, password) {
          if (validate(email, username, password, (err) => socket.emit('register->res', err))) {
            const token = await helpers.randomString(30).catch(function() {
              socket.emit('register->res', 500);
            });
            var userData = {
                email: email,
                username: username,
                password: password,
                balance: 0,
                verified : false,
                verification_token : token,
                session_token : null,
            };
            User.create(userData, function(err) {
              if (err) {
                socket.emit('register->res', 500);
              } else {
                socket.emit('register->res', false);
                mail.sendEmailConfirmation(email, token);    
              }
            });
>>>>>>> origin/deaths
          }
          socket.emit('register->res', false);
          mail.sendEmailConfirmation(email, verification_token);    
        });
      }
    });

    socket.on('resend-confirmation', async function(email) {
      if (!validator.isEmail(email)) {
        socket.emit('resend-confirmation->res', 'INVALID_EMAIL')
        return
      }

      const token = await helpers.randomString(30)
        .catch(function(err) {
          console.error(err)
          socket.emit('resend-confirmation->res', 500);
        });

      User.findOne({
        email,
      }, async function(err, user) {
        if (err && !user) {
          socket.emit('resend-confirmation->res', 500);
          return
        }
        if (user.verified) {
          socket.emit('resend-confirmation->res', 'USER_ALREADY_VERIFIED');
          return
        }
        socket.emit('resend-confirmation->res', false);
        user.verification_token = token
        await user.save()
        mail.sendEmailConfirmation(email, token);
      });
<<<<<<< HEAD
    })
  }
=======
  },

  setRoute : function(app) {
    app.get('/verify/:token', function(req, res) {
      let token = req.params.token;
      User.updateOne(
        {verification_token : token},
        {$set: 
          {"verified": true,
          "verification_token": null}}, function(err, result) {
            if (err || !result) {
              res.status(400);
            } else console.log('validated');
          })
      res.redirect('/');
    });
  },
>>>>>>> origin/deaths
}

async function validateAndCallbackWithErrors (email, username, password, callback) {
  let isValid = true;
  if (validator.isEmail(email)) {
    var isEmailRegistered = await User.findOne({ email })
    if (isEmailRegistered) {
      callback("EMAIL_ALREADY_REGISTERED");
      isValid = false;
    }
  } else {
    callback("INVALID_EMAIL");
    isValid = false;
  }

  var isUsernameRegistered = await User.findOne({ username })
  if (isUsernameRegistered) {
    callback("USERNAME_TAKEN");
    isValid = false;
  }

  if (!owasp.test(password).strong) {
    callback("WEAK_PASSWORD");
    isValid = false;
  }

  return isValid;
}

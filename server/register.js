const User = require('./user');
var owasp = require('owasp-password-strength-test');
var crypto = require('crypto');
var mail = require('./mail');
const helpers = require('./helpers')
const validator = require('validator')

module.exports = {
  
  set : function(socket) {
      socket.on('register', async function(email, username, password) {
          if (validate(email, username, password, (err) => socket.emit('register->res', err))) {
            const token = await helpers.randomString(30).catch(function() {
              socket.emit('register->res', 500);
            });
            var userData = {
                email: email,
                username: username,
                password: password,
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
          }
      });
  }
}

function validate (email, username, password, callback) {
  let error = false;
  if (validator.isEmail(email)) {
    var validEmail = User.findOne({email}, function(err, user) {
      if (err) {
        callback(500)
        error = true
      } else if (user) {
        callback("EMAIL_ALREADY_REGISTERED");
        error = true;
      }
    })
  } else {
    callback("INVALID_EMAIL");
    error = true;
  }
  var validUsername = User.findOne({username}, function(err, user) {
    if (err) {
      callback(500)
      error = true
    } else if (user) {
      callback("USERNAME_TAKEN");
      error = true;
     }
  })
  if (!owasp.test(password).strong) {
    callback("WEAK_PASSWORD");
  }
  return !error;
}
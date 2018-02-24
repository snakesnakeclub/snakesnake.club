const User = require('./user');
var owasp = require('owasp-password-strength-test');
var crypto = require('crypto');
var mail = require('./mail');
const helpers = require('./helpers')

module.exports = {
  
  set : function(io) {

    io.on('connection', function(socket) {
      socket.on('register', async function(email, username, password) {
          if (validate(email, username, password, (err) => socket.emit('register->res', err))) {
            const token = await helpers.randomString(30).catch(function() {
              console.log('Promise Rejected');
            });
            var userData = {
                email: email,
                username: username,
                password: password,
                verified : false,
                verification_token : token,
            };
            User.create(userData, function(err) {
              if (err) {
                  socket.emit('register->res', err);
              } else {
                socket.emit('register->res', false);
                mail.sendEmailConfirmation(email, token);    
              }
            });
          }
      });
    })

  }
}

function validate (email, username, password, callback) {
  var validEmail = User.findOne({email}, function(err, user) {
    if (err || user) callback("EMAIL_ALREADY_REGISTERED");
  })
  var validUsername = User.findOne({username}, function(err, user) {
     if (err || user) callback("USERNAME_TAKEN");
  })
  if (!owasp.test(password).strong) callback("WEAK_PASSWORD");
  return true;
}

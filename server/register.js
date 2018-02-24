const User = require('./user');
var owasp = require('owasp-password-strength-test');
var crypto = require('crypto');

module.exports = {
  
  set : function(io) {

    io.on('connection', function(socket) {
      socket.on('register', function(email, username, password) {
        if (validate(email, username, password, (err) => socket.emit('register->res', err))) {
          const token = crypto.randomBytes(256);

          var userData = {
              email : email,
              username : name,
              password : password,
              verified : false,
              verification_token : token,
          };

          User.create(userData, function(err, user) {
              if (err) {
                  socket.emit('register->res', err);
              } else {
                  // valid registery
              }
          });
      }
      });
    })

  }

}

function validate (email, username, password, callback) {
  var validEmail = User.findOne({email}, function(err, user) {
    if (err || !user) callback("EMAIL_ALREADY_REGISTERED");
  })
  var validUsername = User.findOne({username}, function(err, user) {
     if (err || !user) callback("USERNAME_TAKEN");
  })
  if (!owasp.test(password).strong) callback("WEAK_PASSWORD");
  return true;
}

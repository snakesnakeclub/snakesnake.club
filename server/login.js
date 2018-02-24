const User = require('user');
const helpers = require('./helpers')

module.exports = {
  set : function(socket) {
    socket.on('login', function(username, password) {
      User.findOne({username}, function(err, user) {
        if (err) socket.emit('login->res', err, null);
        else if (!user) socket.emit('login->res', "INVALID_CREDENTIALS", null);
        else {
          if (user.verified) {
            // give the user a session_token
            const token = await helpers.randomString(30).catch(function() {
              console.log('Promise Rejected');
            });
            User.updateOne( // do not call 'login' when a token has been assigned
              {username}, 
              {$set : {"session_token" : token}}, function(err, result) {
                if (err) socket.emit('login->res', "INVALID_CREDENTIALS", null);
                else user.session_token = token;
              });
            socket.emit('login->res', false, serialize(user))
          } else {
            socket.emit('login->res', "EMAIL_NOT_CONFIRMED", null);
          }
        }
      })
    })

    socket.on('login-token', function(token) {
      User.findOne({session_token:token}, function(err, user) {
        if (err) socket.emit('login-token->res', err, null)
        else if (!user) socket.emit('login-token->res', "INVALID_TOKEN", null) 
        else socket.emit('login-token->res', false, serialize(user))
      })
    }) 

  }
}

function serializeData(user) {
  return {
    email : user.email,
    username : user.username,
    session_token : token,
  }
}

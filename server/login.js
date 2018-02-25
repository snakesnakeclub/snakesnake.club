const User = require('./user');
const helpers = require('./helpers')

module.exports = {
  set : function(socket) {

    socket.on('login', function(email, password) {
<<<<<<< HEAD
      User.findOne({ email }, async function(err, user) {
        if (err) {
          socket.emit('login->res', 500, null);
          return
        } else if (!user) {
          socket.emit('login->res', "INVALID_EMAIL", null);
          return
        }

        User.authenticate(email, password, async (err, success) => {
          if (!success) {
            socket.emit('login->res', err)
            return
          }

          if (!user.verified) {
            socket.emit('login->res', "EMAIL_NOT_VERIFIED", null);
            return
          }

          // give the user a session_token
          const token = await helpers.randomString(30)
            .catch(function() {
              socket.emit('login->res', 500, null)
            });

          user.session_token = token
          await user.save()
          socket.emit('login->res', false, serializeData(user))
        })
=======
      User.findOne({email}, async function(err, user) {
        if (err) socket.emit('login->res', err, null);
        else if (!user) socket.emit('login->res', 500, null);
        else {
          if (user.verified) {
            // give the user a session_token
            const token = await helpers.randomString(30).catch(function() {
              socket.emit('login->res', 500, null)
            });
            User.updateOne( // do not call 'login' when a token has been assigned
              {email}, 
              {$set : {"session_token" : token}}, function(err, result) {
                if (err) socket.emit('login->res', 500, null);
                else user.session_token = token;
              });
            socket.emit('login->res', false, serializeData(user))
          } else {
            socket.emit('login->res', "EMAIL_NOT_CONFIRMED", null);
          }
        }
>>>>>>> origin/deaths
      })
    })

    socket.on('login-token', function(token) {
      User.findOne({ session_token: token }, function(err, user) {
        if (err) {
          socket.emit('login-token->res', 500, null)
        } else if (!user) {
          socket.emit('login-token->res', "INVALID_TOKEN", null) 
        } else {
          socket.emit('login-token->res', false, serializeData(user))
        }
      })
    })
  }
}

function serializeData(user) {
  return {
    email : user.email,
    username : user.username,
    session_token : user.session_token,
    balance: user.balance,
    takedowns: user.takedowns,
  }
}

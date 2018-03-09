const User = require('../user');
const helpers = require('./helpers');

module.exports = {
  set(socket) {
    socket.on('login', (email, password) => {
      User.findOne({email}, async (err, user) => {
        if (err) {
          socket.emit('login->res', 500, null);
          return;
        } if (!user) {
          socket.emit('login->res', 'INVALID_EMAIL', null);
          return;
        }

        User.authenticate(email, password, async (err, success) => {
          if (err) {
            socket.emit('login->res', err);
            return;
          }

          if (!user.verified) {
            socket.emit('login->res', 'EMAIL_NOT_VERIFIED', null);
            return;
          }

          // Give the user a session_token
          const token = await helpers.randomString(30)
            .catch(() => {
              socket.emit('login->res', 500, null);
            });

          user.session_token = token;
          await user.save();
          socket.emit('login->res', false, serializeData(user));
        });
      });
    });

    socket.on('login-token', token => {
      if (!token) {
        socket.emit('login-token->res', 'INVALID_TOKEN', null);
        return
      }
      User.findOne({ session_token: token }, (err, user) => {
        if (err) {
          socket.emit('login-token->res', 500, null);
        } else if (!user) {
          socket.emit('login-token->res', 'INVALID_TOKEN', null);
        } else {
          socket.emit('login-token->res', false, serializeData(user));
        }
      });
    });
  }
};

function serializeData(user) {
  return {
    email: user.email,
    username: user.username,
    session_token: user.session_token,
    balance: user.balance,
    takedowns: user.takedowns
  };
}

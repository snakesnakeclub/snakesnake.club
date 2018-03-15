const User = require('../models/user');

module.exports = {

  set(socket) {
    socket.on('logout', session_token => {
      // Remove the session_token
      User.updateOne(
        {session_token},
        {$set: {session_token: null}}, (err, result) => {
          if (err) {
            socket.emit('logout->res', 500);
          } else if (!result) {
            socket.session_token = null;
            socket.emit('logout->res', 'INVALID_TOKEN');
          } else {
            socket.session_token = null;
            socket.emit('logout->res', false);
          }
        });
    });
  }

};

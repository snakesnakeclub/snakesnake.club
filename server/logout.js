const user = require('./user')

module.exports = {

  set : function (socket) {
    socket.on('logout', function(session_token) {
      User.findOne({session_token}, function(err, result) {
        // remove the session_token
        User.updateOne(
          {session_token}, 
          {$set : {"session_token" : null}}, function (err, result) {
            if (err) socket.emit('logout->resp', 500);
            else if (!result) socket.emit('logout->resp', 'INVALID_TOKEN');
            socket.emit('logout->resp', false);
          })
      })
    })
  }

}

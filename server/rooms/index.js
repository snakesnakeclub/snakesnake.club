const Room = require('./room');
const User = require('../user');
var open = [];

function serialize (user) {
  return {
    id : user.id,
    balance : user.balance,
  }
}

function getRoom (room_id) {
  for (i=0; i < open.length; i++) {
    if (open[i].id == room_id) {
      return open[i];
    }
  }
  return false;
}

function EnterRoom (user, room, socket) {
  var newbalance = user.balance - room.fee;
  User.updateOne(
    {token_session: user.token_session},
    {$set:
      {"balance": newbalance}}, function(err, result) {
        if (err || !result) {
          socket.emit('play->res', 500)
        } else {
          room.addPlayer(socket, serialize(user))
        }
      }
  )
}

module.exports = {
  setRooms : function(io) {
    room1 = new Room(io, 0, 0);
    room2 = new Room(io, 1, 1);
    open.push(room1);
    open.push(room2);
  },

  setConnections : function(socket) {
    var roomData = {
      rooms : open.map(room => room.serialize()), 
    }
    socket.emit('setRooms', roomData);

    socket.on('play', function(room_id, token_session) {
      console.log(token_session);
      User.findOne({session_token : token_session}, function(err, user) {
        if (err) socket.emit('play->res', 500);
        else if (!user) {
          socket.emit('play->res', "INVALID_TOKEN")
        } else {
          var selectedRoom = getRoom(room_id);
          if (selectedRoom) {
            if (selectedRoom.fee <= user.balance) {
              EnterRoom(user, selectedRoom, socket);
            } else {
              socket.emit('play->res', "INSUFFICIENT_COINS")
            }
          } else {
            socket.emit('play->res', "INVALID_ROOM_ID")
          }
        }
      })
    })


  }
}

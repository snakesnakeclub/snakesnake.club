const Room = require('./room');
const User = require('../user');

const openRooms = [];

function serialize(user) {
  return {
    id: user.id,
    balance: user.balance
  };
}

function getRoom(room_id) {
  for (i = 0; i < openRooms.length; i++) {
    if (openRooms[i].id == room_id) {
      return openRooms[i];
    }
  }
  return false;
}

function EnterRoom(user, room, socket) {
  const newbalance = user.balance - room.fee;
  User.updateOne(
    {token_session: user.token_session},
    {$set:
      {balance: newbalance}}, (err, result) => {
      if (err || !result) {
        socket.emit('play->res', 500);
      } else {
        room.addPlayer(socket, serialize(user));
        socket.room_id = room;
      }
    }
  );
}

module.exports = {
  setRooms(io) {
    openRooms.push(new Room(io, 1, 0));
    openRooms.push(new Room(io, 2, 1));
  },

  setConnections(socket) {
    socket.on('getRooms', () => {
      socket.emit('getRooms->res', openRooms.map(room => room.serializeForLobby()));
    });

    socket.on('play', (room_id, token_session) => {
      User.findOne({session_token: token_session}, (err, user) => {
        if (err) {
          socket.emit('play->res', 500);
        } else if (!user) {
          socket.emit('play->res', 'INVALID_TOKEN');
        } else {
          const selectedRoom = getRoom(room_id);
          if (selectedRoom) {
            if (selectedRoom.fee <= user.balance) {
              socket.emit('play->res', null);
              EnterRoom(user, selectedRoom, socket);
              socket.current_room = room_id;
            } else {
              socket.emit('play->res', 'INSUFFICIENT_COINS');
            }
          } else {
            socket.emit('play->res', 'INVALID_ROOM_ID');
          }
        }
      });
    });

    socket.on('disconnect', function() { // player disconnects from game
      if (socket.current_room > 0) {
        getRoom(socket.current_room).removePlayer(socket);
      }
    }); 

  }
};

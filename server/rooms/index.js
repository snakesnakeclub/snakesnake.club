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
      }
    }
  );
}

module.exports = {
  setRooms(io) {
    openRooms.push(new Room(io, 0, 0));
    openRooms.push(new Room(io, 1, 1));
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
              EnterRoom(user, selectedRoom, socket);
            } else {
              socket.emit('play->res', 'INSUFFICIENT_COINS');
            }
          } else {
            socket.emit('play->res', 'INVALID_ROOM_ID');
          }
        }
      });
    });
  }
};

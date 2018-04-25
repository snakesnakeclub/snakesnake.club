const Room = require('./room');
const User = require('../models/user');
const FreeRoomModerator = require('../moderators/FreeRoomModerator');

const rooms = new Map();

function serialize(user) {
  return {
    id: user.id,
    balance: user.balance
  };
}

function removePlayer(socket) {
  if (socket.current_room > 0) {
    room = rooms.get(socket.current_room);
    room.getModerator().removePlayer(socket);
    socket.current_room = null;
    socket.leave(room.id);
  }
}

module.exports = {
  setRooms(io) {
    rooms.set(1, new Room(io, 1, 0, new FreeRoomModerator(io)));
    // Rooms.set(2, new Room(io, 2, 1));
  },

  setConnections(socket) {
    socket.on('getRooms', () => {
      socket.emit('getRooms->res', Array.from(rooms.values())
        .map(room => room.serializeForLobby()));
    });

    socket.on('joinRoom', (room_id, token_session) => {
      User.findOne({session_token: token_session})
        .populate('active_skin')
        .exec(async (err, user) => {
          if (err) {
            socket.emit('joinRoom->res', 500);
            return;
          } if (!user) {
            socket.emit('joinRoom->res', 'INVALID_TOKEN');
            return;
          }

          const selectedRoom = rooms.get(room_id);

          if (!selectedRoom) {
            socket.emit('joinRoom->res', 'INVALID_ROOM_ID');
            return;
          }

          if (selectedRoom.fee > user.balance) {
            socket.emit('joinRoom->res', 'INSUFFICIENT_COINS');
            return;
          }

          user.balance -= selectedRoom.fee;
          await user.save();
          if (selectedRoom.getModerator().addPlayer(socket, user.active_skin)) {
            socket.join(selectedRoom.id);
            socket.current_room = room_id;
            socket.emit('joinRoom->res', null);
          } else {
            socket.emit('joinRoom->res', 'ROOM_FULL');
          }
        });
    });

    socket.on('spawn', () => {
      room = rooms.get(socket.current_room);
      if (room) {
        room.getModerator().spawnPlayer(socket);
      }
    });

    socket.on('leaveRoom', () => {
      removePlayer(socket);
    });

    socket.on('disconnect', () => {
      removePlayer(socket);
    });
  }
};

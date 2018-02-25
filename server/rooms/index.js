const Room = require('./room');
const User = require('../user');

const open = [];

function serialize(user) {
	return {
		id: user.id,
		balance: user.balance
	};
}

function getRoom(room_id) {
	for (i = 0; i < open.length; i++) {
		if (open[i].id == room_id) {
			return open[i];
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
		room1 = new Room(io, 0, 0);
		room2 = new Room(io, 1, 1);
    open.push(room1);
    open.push(room2);
	},

	setConnections(socket) {
		const roomData = {
			rooms: open.map(room => room.serialize())
		};
    socket.emit('setRooms', roomData);

    socket.on('play', (room_id, token_session) => {
      console.log(token_session);
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

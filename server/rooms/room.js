const Player = require('./player');
const Reward = require('./rewards');
const World = require('./world');
const {randomInteger} = require('./helpers.js');

class Room {
  constructor(io, id, fee) {
    this.io = io;
    this.id = id;
    this.fee = fee;
    this.players = new Map(); // Socket.id -> player which holds user's data
    this.loading = new Map();  // socket.id -> player
    this.world = new World(30, 30); // Width length
    this.rewards = [];
    setInterval(this.gameTick.bind(this), 1000 / 6);
  }

  spawn(socket) {
    var player = this.loading.get(socket.id);
    this.loading.delete(socket.id);
    this.players.set(socket.id, player);

    this.rewards.push(new Reward(this.world));
    this.rewards.push(new Reward(this.world));
  }

  addPlayer(socket, data) { // User data and socket
    socket.join(this.id);
    const player = new Player(this.world, socket.id);
    socket.on('setDirection', direction => {
      player.setDirection(direction);
    });
    this.loading.set(socket.id, player);
  }

  playerDeath(socket) {
    socket.emit('death');
    var player = this.players.get(socket.id);
    player.reset();
    this.players.delete(socket.id);
    this.loading.set(socket.id, player);
  }
  
  removePlayer(socket) { // User data and socket
    this.players.delete(socket.id);
    this.rewards.pop();
  }

  gameTick() {
    const playersArray = Array.from(this.players.values());
    playersArray.forEach(player => {
      const head = player.head();
      // If the player's head collided with an apple
      const hitReward = this.rewards.some(reward =>
        head.isCollidingWith(reward)  && reward.respawn()
      );

      if (hitReward) {
        player.grow();
      } else {
        player.move();
      }

      // Whether or not the player's head collided with another player piece in
      // the world
      const didCollideWithPlayerPiece = playersArray.some(aPlayer =>
        aPlayer.pieces.some(piece => head.isCollidingWith(piece))
      );

      if (didCollideWithPlayerPiece) {
        // Socket id of dead player
        const length = player.pieces.length;
        const socket = this.io.sockets.connected[player.id];
        this.playerDeath(socket);
        //this.rewards.pop();

        // This.updateBalance(this.players.get(aPlayer.id));
        // Across tick length
      }
    });
    this.io.to(this.id).emit('room-tick', this.serialize());
  }

  serialize() {
    return {
      id: this.id,
      world: this.world.serialize(),
      players: Array.from(this.players.values()).map(player => player.serialize()),
      rewards: this.rewards.map(reward => reward.serialize())
    };
  }

  serializeForLobby() {
    return {
      id: this.id,
      fee: this.fee,
      world: this.world.serialize(),
    };
  }
}

function updateBalance(player) {
  // Update the players balance = balance + fee
  // Number of kills +1
}

module.exports = Room;

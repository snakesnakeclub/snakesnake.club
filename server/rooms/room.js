const Player = require('./player');
const Reward = require('./rewards');
const World = require('./world');
const {randomInteger} = require('../helpers.js');

class Room {
  constructor(io, id, fee) {
    // room details  
    this.io = io;
    this.id = id;
    this.fee = fee;
    
    // objects in room
    this.alive_players = new Map();
    this.dead_players = new Map();  
    this.rewards = [];

    this.world = new World(30, 30);

    setInterval(this.gameTick.bind(this), 1000 / 6);
  }

  /**
   * The player of socket, can now play in the room.
   * 
   * @param {socket} socket players socket
   */
  spawnPlayer(socket) {
    var player = this.dead_players.get(socket.id);
    this.dead_players.delete(socket.id);

    this.alive_players.set(socket.id, player);
  }

  /**
   * The player of socket's state is changed to dead and cannot play in the 
   * room.
   * 
   * @param {socket} socket players socket
   */
  killPlayer(socket) {
    socket.emit('death');

    var player = this.alive_players.get(socket.id);
    player.reset();
    this.alive_players.delete(socket.id);
    this.dead_players.set(socket.id, player);
  }

  /**
   * Adds a new player to the room, by default in the dead state.
   * 
   * @param {socket} socket players socket
   */
  addPlayer(socket) {
    socket.join(this.id);

    const player = new Player(this.world, socket.id);
    socket.on('setDirection', direction => {
      player.setDirection(direction);
    });

    this.dead_players.set(socket.id, player);

    this.rewards.push(new Reward(this.world));
    this.rewards.push(new Reward(this.world));
  }
  
  /**
   * Removes a player from the room, along with two rewards.
   * 
   * @param {socket} socket players socket
   */
  removePlayer(socket) {
    this.alive_players.delete(socket.id);

    this.rewards.pop();
    this.rewards.pop();
  }

  gameTick() {
    const playersArray = Array.from(this.alive_players.values());
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
        this.killPlayer(socket);
        //this.rewards.pop();

        // This.updateBalance(this.alive_players.get(aPlayer.id));
        // Across tick length
      }
    });
    this.io.to(this.id).emit('room-tick', this.serialize());
  }

  serialize() {
    return {
      id: this.id,
      world: this.world.serialize(),
      players: Array.from(this.alive_players.values()).map(player => player.serialize()),
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

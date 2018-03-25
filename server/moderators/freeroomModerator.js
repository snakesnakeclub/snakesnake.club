const Moderator = require('./Moderator');
const Player = require('../game-objects/player');
const Reward = require('../game-objects/reward');

module.exports = class FreeRoomModerator extends Moderator {
  constructor() {
    super();
  }

  rewardPlayer(player) {
    player.grow();
  }

  /**
   * player1 has collided with a player piece of player2
   * 
   * @param {Player} player1 
   * @param {Player} player2 
   */
  collision(player1, player2) {
    const socket = this.io.sockets.connected[player1.id];
    this.killPlayer(socket);
  }

  /**
   * Adds a new player to the room, by default in the dead state.
   * 
   * @param {socket} socket players socket
   */
  addPlayer(socket) {
    const player = new Player(this.world, socket.id);
    socket.on('setDirection', direction => {
      player.setDirection(direction);
    });

    this.deadPlayers.set(socket.id, player);

    this.rewards.push(new Reward(this.world));
    this.rewards.push(new Reward(this.world));
  }
  

  /**
   * The player of socket, can now play in the room.
   * 
   * @param {socket} socket players socket
   */
  spawnPlayer(socket) {
    var player = this.deadPlayers.get(socket.id);
    this.deadPlayers.delete(socket.id);
  
    this.alivePlayers.set(socket.id, player);
  }

  /**
   * The player of socket's state is changed to dead and cannot play in the 
   * room.
   * 
   * @param {socket} socket players socket
   */
  killPlayer(socket) {
    socket.emit('death');

    var player = this.alivePlayers.get(socket.id);
    player.reset();
    this.alivePlayers.delete(socket.id);
    this.deadPlayers.set(socket.id, player);
  }
  
  /**
   * Removes a player from the room, along with two rewards.
   * 
   * @param {socket} socket players socket
   */
  removePlayer(socket) {
    this.alivePlayers.delete(socket.id);
    this.rewards.pop();
    this.rewards.pop();
  }
}

const Moderator = require('./Moderator');
const Player = require('../game-objects/player');
const Reward = require('../game-objects/reward');

module.exports = class FreeRoomModerator extends Moderator {
  constructor(io) {
    super(io);
  }

  rewardPlayer(player, reward) {
    player.grow();
    if (reward)
      reward.respawn();
  }

  /**
   * player1 and player2 have collided
   * 
   * @param {Player} player1 
   * @param {Player} player2 
   */
  collision(player1, player2) {
    let p1Socket = this.io.sockets.connected[player1.id];
    let p2Socket = this.io.sockets.connected[player2.id];

    if (p2Socket && player2.head.isCollidingWith(player1.head)) {
       this.killPlayer(p2Socket);
    } else {
      this.rewardPlayer(player2);
    }
    p1Socket ? this.killPlayer(p1Socket) : null;
  }

  /**
   * Adds a new player to the room, by default in the dead state.
   * 
   * @param {socket} socket players socket
   */
  addPlayer(socket) {
    if (socket) {
      const player = new Player(this.world, socket.id);
      socket.on('setDirection', direction => {
        player.setDirection(direction);
      });

      this.deadPlayers.set(socket.id, player);
      this.rewards.push(new Reward(this.world));
      this.rewards.push(new Reward(this.world));
    }
  }
  

  /**
   * The player of socket, can now play in the room.
   * 
   * @param {socket} socket players socket
   */
  spawnPlayer(socket) {
    if (socket) {
      var player = this.deadPlayers.get(socket.id);
      if (player) {
        this.deadPlayers.delete(socket.id);
        this.alivePlayers.set(socket.id, player);
      }
    }
  }

  /**
   * The player of socket's state is changed to dead and cannot play in the 
   * room.
   * 
   * @param {socket} socket players socket
   */
  killPlayer(socket) {
    if (socket) {
      socket.emit('death');
      var player = this.alivePlayers.get(socket.id);
      if (player) {
        player.reset();
        this.alivePlayers.delete(socket.id);
        this.deadPlayers.set(socket.id, player);
      } 
    }
  }
  
  /**
   * Removes a player from the room, along with two rewards.
   * 
   * @param {socket} socket players socket
   */
  removePlayer(socket) {
    if (socket) {
      this.alivePlayers.delete(socket.id);
      this.rewards.pop();
      this.rewards.pop();
    }
  }

}

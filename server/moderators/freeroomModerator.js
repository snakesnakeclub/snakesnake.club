const Moderator = require('./Moderator');
const Player = require('../game-objects/player');
const Reward = require('../game-objects/reward');

module.exports = class FreeRoomModerator extends Moderator {
  constructor(io) {
    super(io);
    this.playerLimit = 6;
    // every even indexed piece will be dead on player death
    this.deadRewardSpawnRate = 2; 
  }

  rewardCollision(player, reward) {
    if (player.notBoosted()) {
      let alive = player.boost();
      if (!alive) {
        this.boundryCollision(player);
        return false;
      }
    }
    if (reward) {
      this.rewardRespawn(reward);
    }
    return true;
  }

  rewardRespawn(reward) {
    if (this.rewards.get(reward))
      reward.respawn();
    else 
      this.rewards.delete(reward);
  }

  boundryCollision(player) {
    let p1socket = this.io.sockets.connected[player.id];
    if (p1socket) {
      this.killPlayer(p1socket);
    }
  }

  /**
   * Increases world limit by 10 units
   * Returns true to confirm the player can join the room.
   */
  limitReached() {
    this.world.increaseWidth(10);
    this.world.increaseHeight(10);
    return true;
  }

  /**
   * player1 and player2 have collided
   * 
   * @param {Player} player1 
   * @param {Player} player2 
   */
  playerCollision(player1, player2) {
    let p1Socket = this.io.sockets.connected[player1.id];
    let p2Socket = this.io.sockets.connected[player2.id];

    if (p2Socket && player2.head.isCollidingWith(player1.head)) {
       this.killPlayer(p2Socket);
    } else {
      if (!player2.grow()) {
        this.boundryCollision(player2);
      }
    }
    p1Socket ? this.killPlayer(p1Socket) : null;
  }

  /**
   * Adds a new player to the room, by default in the dead state.
   * 
   * @param {socket} socket players socket
   */
  addPlayer(socket) {
    if (!socket)
      return false;
    if (this.alivePlayers.get(socket.id) || this.deadPlayers.get(socket.id))
      return false;

    let numberOfPlayers = this.alivePlayers.size + this.deadPlayers.size;
    if (numberOfPlayers % this.playerLimit == 0) {
      let playerCanBeAddedToRoom = this.limitReached();
      if (!playerCanBeAddedToRoom)
        return false;
    }

    const player = new Player(this.world, socket.id);
    socket.on('setDirection', direction => {
      player.setDirection(direction);
    });

    this.deadPlayers.set(socket.id, player);
    this.rewards.set(new Reward(this.world), true);
    this.rewards.set(new Reward(this.world), true);
    return true;
  }

  /**
   * The player of socket, can now play in the room.
   * 
   * @param {socket} socket players socket
   */
  spawnPlayer(socket) {
    if (!socket) 
      return;

    let player = this.deadPlayers.get(socket.id);
    if (!player) 
      return;

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
    if (socket) {
      socket.emit('death');
      var player = this.alivePlayers.get(socket.id);
      if (player) {
        player.pieces.forEach((piece, index) => {
          if (index % this.deadRewardSpawnRate === 0) {
            var deadReward = new Reward(this.world, piece.x, piece.y);
            this.rewards.set(deadReward, false);
          }
        })
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
      let player = this.alivePlayers.delete(socket.id);
      socket.current_room = null;
      this.rewards.delete(player.reward1);
      this.rewards.delete(player.reward2);
    }
  }
}

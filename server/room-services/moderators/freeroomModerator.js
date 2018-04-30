const Moderator = require('./moderator');
const Player = require('../../game-objects/player');
const Reward = require('../../game-objects/reward');

module.exports = class FreeRoomModerator extends Moderator {
  constructor(io) {
    super(io);
    this.playerLimit = 6;
    // Every even indexed piece will be dead on player death
    this.deadRewardSpawnRate = 2;
  }

  rewardCollision(player, reward) {
    player.grow() ? null : this.boundryCollision(player);
    this.rewardRespawn(reward);
    return true;
  }

  rewardRespawn(reward) {
    if (reward) {
      if (this.rewards.get(reward)) 
        reward.respawn();
      else 
        this.rewards.delete(reward);
    }
  }

  boundryCollision(player) {
    const p1socket = this.io.sockets.connected[player.socketID];
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
   * Player1 and player2 have collided
   *
   * @param {Player} player1
   * @param {Player} player2
   */
  playerCollision(player1, player2) {
    if (this.isDead(player1) || this.isDead(player2)) return;
      
    const p1Socket = this.io.sockets.connected[player1.socketID];
    const p2Socket = this.io.sockets.connected[player2.socketID];

    if (p2Socket && player2.head.isCollidingWith(player1.head)) {
      this.killPlayer(p2Socket);
    } else if (!player2.grow()) {
      this.boundryCollision(player2);
    }
    p1Socket ? this.killPlayer(p1Socket) : null;
  }

  /**
   * Adds a new player to the room, by default in the dead state.
   *
   * @param {socket} socket 
   * @param {object} skin 
   */
  addPlayer(user) {
    var socket = user.socket;
    if (this.isInRoom(socket))
      return false;
    
    const numberOfPlayers = this.alivePlayers.size + this.deadPlayers.size;
    if (numberOfPlayers > 0 && numberOfPlayers % this.playerLimit == 0) {
      this.playerLimit *= 2;      
      const playerCanBeAddedToRoom = this.limitReached();
      if (!playerCanBeAddedToRoom) {
        return false;
      }
    }

    var skin = user.active_skin;
    const player = new Player(this.world, socket.id, user.id, skin);
    socket.on('setDirection', direction => {
      player.setDirection(direction);
    });

    this.deadPlayers.set(socket.id, player);
    var reward1 = new Reward(this.world);
    var reward2 = new Reward(this.world);

    player.respawnRewards.push(reward1);
    player.respawnRewards.push(reward2);

    this.rewards.set(reward1, true);
    this.rewards.set(reward2, true);
    return true;
  }

  /**
   * The player of socket, can now play in the room.
   *
   * @param {socket} socket players socket
   */
  spawnPlayer(socket) {
    if (this.isInRoom(socket) && this.isDead(socket)) {
      const player = this.deadPlayers.get(socket.id);
      this.deadPlayers.delete(socket.id);
      this.alivePlayers.set(socket.id, player);
    }
  }

  /**
   * The player of socket's state is changed to dead and cannot play in the
   * room.
   *
   * @param {socket} socket players socket
   */
  killPlayer(socket) {
    if (this.isAlive(socket)) {
      socket.emit('death');
      
      const player = this.getPlayer(socket); 
      this.transformToRewards(player);       
      player.reset();

      this.alivePlayers.delete(socket.id);
      this.deadPlayers.set(socket.id, player);
    }
  }

  /**
   * Removes a player from the room, along with two rewards.
   *
   * @param {socket} socket players socket
   */
  removePlayer(socket) {
    if (this.isInRoom(socket)) {    
      socket.current_room = null;
      var player = this.getPlayer(socket);
      
      this.rewards.delete(player.respawnRewards.pop())
      this.rewards.delete(player.respawnRewards.pop())

      if (this.isDead(socket)) 
        this.deadPlayers.delete(socket.id);
      else 
        this.alivePlayers.delete(socket.id);
      this.statTracker.updateTakedowns(player.userID);
      socket.removeAllListeners('setDirection');
    }
  }

  transformToRewards(player) {
    player.pieces.forEach((piece, index) => {
      if (index % this.deadRewardSpawnRate === 0) {
        const deadReward = new Reward(this.world, piece.x, piece.y);
        this.rewards.set(deadReward, false);
      }
    });
  }

  isDead(socket) {
    return socket && this.deadPlayers.has(socket.id);
  }

  isAlive(socket) {
    return socket && this.alivePlayers.has(socket.id);
  }

  isInRoom(socket) {
    return socket && 
      (this.alivePlayers.has(socket.id) || this.deadPlayers.has(socket.id));
  }

  getPlayer(socket) {
    if (!this.isInRoom(socket)) return;

    if (this.isDead(socket)) 
      return this.deadPlayers.get(socket.id);
    else 
      return this.alivePlayers.get(socket.id);
  }

};

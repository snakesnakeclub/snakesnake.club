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
    let playerSocket = this.getSocket(player.socketID);
    var shouldGrow = true;
    switch (reward.type) {
      case 'grow-respawn':
        reward.respawn();
        break;
      case 'takedown':
        this.statTracker.increaseTakedowns(player.userID, playerSocket);
        shouldGrow = false;
      case 'grow':
        this.rewards.delete(reward);
    }
    if (shouldGrow) {
      var hasDied = !player.grow();
    } else {
      var hasDied = !player.move();
    }

    if (hasDied) this.boundryCollision(player);
  }

  boundryCollision(player) {
    const p1socket = this.getSocket(player.socketID);
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
      
    const p1Socket = this.getSocket(player1.socketID);
    const p2Socket = this.getSocket(player2.socketID);

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
    var reward1 = new Reward(this.world, 'grow-respawn');
    var reward2 = new Reward(this.world, 'grow-respawn');

    player.respawnRewards.push(reward1);
    player.respawnRewards.push(reward2);

    this.rewards.add(reward1);
    this.rewards.add(reward2);
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
      this.setValidPosition(player);      
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
      if (index === (player.pieces.length - 1)) {
        this.rewards.add(
          new Reward(this.world, 'takedown', piece.x, piece.y)
        );
      } else {
        if (index % this.deadRewardSpawnRate === 0) {
          this.rewards.add(
            new Reward(this.world, 'grow', piece.x, piece.y)
          );
        }
      }
    });
  }

  setValidPosition(player) {
    var valid = false;
    do {
      player.reset();
      var alivePlayers = Array.from(this.alivePlayers);
      valid = !alivePlayers.some(alivePlayer => {
        return alivePlayer.pieces.some(piece => {
          return piece.isCollidingWith(player.pieces[0]);
        });
      });
    } while (!valid)
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

  getSocket(socketID) {
    return this.io.sockets.connected[socketID];
  }

};

const Player = require('../game-objects/player');
const Reward = require('../game-objects/reward');
const World = require('../game-objects/world');
const {randomInteger} = require('../helpers.js');

class Room {
  constructor(io, id, fee, moderator) {
    // room details  
    this.io = io;
    this.id = id;
    this.fee = fee;
    this.moderator = moderator;

    setInterval(this.gameTick.bind(this), 1000 / 6);
  }

  getModerator() {
    return this.moderator;
  }

  gameTick() {
    const playersArray = Array.from(this.moderator.alivePlayers.values());
    
    playersArray.forEach(player => {
      playersArray.some(aPlayer =>
        aPlayer.pieces.some(piece => 
          player.head.isCollidingWith(piece)) ? this.moderator.collision(player, aPlayer) : null
      );

      if (this.moderator.alivePlayers.get(player.id)) { // player is still alive
        let hitReward = this.moderator.rewards.some(reward => {
          if (player.head.isCollidingWith(reward)) {
            this.moderator.rewardPlayer(player, reward);
            return true;
          }
          return false;
        });

        hitReward ? null : player.move()
      }

    });

    this.io.to(this.id).emit('room-tick', this.serialize());
  }

  serialize() {
    return {
      id: this.id,
      world: this.moderator.world.serialize(),
      players: Array.from(this.moderator.alivePlayers.values()).map(player => player.serialize()),
      rewards: this.moderator.rewards.map(reward => reward.serialize())
    };
  }

  serializeForLobby() {
    return {
      id: this.id,
      fee: this.fee,
      world: this.moderator.world.serialize(),
    };
  }
}

module.exports = Room;

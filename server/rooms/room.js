const Player = require('../game-objects/player');
const Reward = require('../game-objects/reward');
const World = require('../game-objects/world');
const {randomInteger} = require('../helpers.js');

class Room {
  constructor(io, id, fee, moderator) {
    // Room details
    this.io = io;
    this.id = id;
    this.fee = fee;
    this.moderator = moderator;

    setInterval(this.gameTick.bind(this), 1000 / 7);
  }

  getModerator() {
    return this.moderator;
  }

  gameTick() {
    const playersArray = Array.from(this.moderator.alivePlayers.values());
    const rewardsArray = Array.from(this.moderator.rewards.keys());

    playersArray.forEach(player => {
      let playerHasDied = false;

      playersArray.some(aPlayer =>
        aPlayer.pieces.some(piece => {
          if (player.head.isCollidingWith(piece)) {
            this.moderator.playerCollision(player, aPlayer);
            playerHasDied = true;
          }
        }));

      if (!playerHasDied) { // Player is still alive, reward detection
        let hasHitReward = false;

        rewardsArray.forEach(reward => {
          if (player.head.isCollidingWith(reward)) {
            hasHitReward = true;
            this.moderator.rewardCollision(player, reward);
          }
        });
        if (!hasHitReward && !player.move()) {
          this.moderator.boundryCollision(player);
        }

        if (playerHasDied) {
          this.moderator.boundryCollision(player);
        }
      }
    });
    this.io.to(this.id).emit('room-tick', this.serialize());
  }

  serialize() {
    return {
      id: this.id,
      world: this.moderator.world.serialize(),
      players: Array.from(this.moderator.alivePlayers.values()).map(player => player.serialize()),
      rewards: Array.from(this.moderator.rewards.keys()).map(reward => reward.serialize())
    };
  }

  serializeForLobby() {
    return {
      id: this.id,
      fee: this.fee,
      world: this.moderator.world.serialize()
    };
  }
}

module.exports = Room;

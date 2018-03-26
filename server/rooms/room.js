const Player = require('./player');
const Reward = require('./rewards');
const World = require('./world');
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
    const playersArray = Array.from(this.moderator.alivePlayers);

    playersArray.forEach(player => {

      playersArray.some(aPlayer =>
        aPlayer.pieces.some(piece => 
          head.isCollidingWith(piece)) ? this.moderator.collision(player, aPlayer) : null
      );

      if (this.moderator.alivePlayers.get(player)) { // player is still alive
        let hitReward = rewards.some(reward =>
          player.head.isCollidingWith(reward) ? this.moderator.reward(player) : null
        );

        hitReward ? null : player.move()
      }

    });

    this.io.to(this.id).emit('room-tick', this.serialize());
  }

  serialize() {
    return {
      id: this.id,
      world: this.moderator.world.serialize(),
      players: Array.from(this.moderator.alivePlayers).map(player => player.serialize()),
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

const Player = require('./player');
const Reward = require('./rewards');
const World = require('./world');
const { randomInteger } = require('./helpers.js');

class Room {

  constructor(io, id, fee) {
    this.io = io;
    this.id = id;
    this.fee = fee;
    this.players = new Map(); // player which holds user's data
    this.world = new World(); // width length
    this.rewards = [];
    setInterval(this.gameTick.bind(this), 10000 / 7)
  }

  addPlayer(socket, data) { // user data and socket
    socket.join(this.id)
    this.players.set(socket.id, new Player(data));
    this.rewards.push(new Reward(this.world))
  }

  removePlayer(socket) { // user data and socket
    socket.leave(this.id)
    this.players.delete(socket.id);
    this.rewards.pop()
  }

  gameTick() {
    const playersArray = Array.from(this.players.values())

    playersArray.forEach(player => {
      const head = player.head()
  
      // If the player's head collided with an apple
      const didEatApple = this.rewards.some((reward) => 
        head.isCollidingWith(reward) && reward.respawn()
      )
  
      if (didEatApple) {
        player.grow()
      } else {
        player.move()
      }
  
      // Whether or not the player's head collided with another player piece in
      // the world
      const didCollideWithPlayerPiece = playersArray.some(aPlayer =>
        aPlayer.pieces.some(piece => head.isCollidingWith(piece))
      )
  
      if (didCollideWithPlayerPiece) {
        // Remove the player from the world
        players.delete(player.id)
        // Remove an apple from the world
        rewards.pop()
      }
    })
    this.io.to(this.id).emit('room-tick', this.serialize());
  } 

  serialize() {
    return {
      id : this.id,
      world : this.world.serialize(),
      players : Array.from(this.players.values()).map(player => player.serialize()),
      rewards : this.rewards.map(reward => reward.serialize()),
    }
  }

}

module.exports = Room;

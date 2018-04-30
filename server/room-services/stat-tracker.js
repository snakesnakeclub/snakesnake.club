var User = require('../models/user');

module.exports = class StatTracker {

  constructor() {
    this.trackingPlayers = new Map();
  }

  increaseTakedowns(userID) {
    if (this.trackingPlayers.has(userID)) {
      var takedownCount = this.trackingPlayers.get(userID);
    } else {
      var takedownCount = 0;
    }
    this.trackingPlayers.set(userID, takedownCount+1);
  }

  async updateTakedowns(userID) {
    var user = await User.findOne({_id : userID})
      .catch(err => {
        console.log(err);
        return;
      });
    if (this.trackingPlayers.has(userID)) {
      var newTakedowns = this.trackingPlayers.get(userID);
      this.trackingPlayers.delete(userID);
      user.takedowns += newTakedowns;
      await user.save();
    }
  }

}

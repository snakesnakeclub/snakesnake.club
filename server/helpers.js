const crypto = require('crypto');

module.exports = {
  /**
   * Returns a random integer between `from` and `to`.
   *
   * @param {number} from integer, inclusive
   * @param {number} to integer, exclusive
   */
  randomInteger(from, to) {
    return Math.round(Math.random() * (to - from - 1)) + from;
  },

  async randomString(length) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buff) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(buff.toString('hex'));
      });
    });
  }

};

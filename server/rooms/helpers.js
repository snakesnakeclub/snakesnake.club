/**
 * Returns a random integer between `from` and `to`.
 * 
 * @param {number} from integer, inclusive
 * @param {number} to integer, exclusive
 */

module.exports = {
  
  randomInteger : function(from, to) {
    return Math.round(Math.random() * (to - from - 1)) + from
  }
}

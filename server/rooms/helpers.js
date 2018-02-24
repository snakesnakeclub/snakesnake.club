/**
 * Returns a random integer between `from` and `to`.
 * 
 * @param {number} from integer, inclusive
 * @param {number} to integer, exclusive
 */
function randomInteger(from, to) {
  return Math.round(Math.random() * (to - from - 1)) + from
}

module.exports = {
  randomInteger,
}

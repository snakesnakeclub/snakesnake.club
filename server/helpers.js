const crypto = require('crypto')

module.exports = {

  randomString : async function(length) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buff) => {
        if (err) {
          reject(err)
          return
        }
        resolve(buff.toString('hex'))
      })
    })
  }

}

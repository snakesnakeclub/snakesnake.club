/* eslint-env node */
const User = require('../user.js');

function poolToMiner(conn, data) {
  try {
    data = JSON.parse(data);
    if (data.id === conn.pid && data.result) {
      if (data.result.id) {
        conn.workerId = data.result.id;
        conn.miner.emit('miner-message', {
          type: 'authed',
          params: {
            token: '',
            hashes: conn.miner.unverifiedShares
          }
        });
        conn.miner.emit('miner-message', {
          type: 'job',
          params: data.result.job
        });
      } else if (data.result.status === 'OK') {
        conn.miner.verifiedShares += 1;
        if (conn.miner.session_token) {
          User.findOne({ session_token: conn.miner.session_token }, async (err, user) => {
            if (err) {
              conn.miner.emit('balance', 500, null);
              return
            } else if (!user) {
              conn.miner.emit('balance', 'INVALID_TOKEN', null);
              return
            }
            user.balance += 1;
            conn.miner.attributedVerifiedShares += 1;
            await user.save()
            conn.miner.emit('balance', false, user.balance);
          });
        }
        conn.miner.emit('miner-message', {
          type: 'hash_accepted',
          params: {
            hashes: conn.miner.verifiedShares
          }
        });
      }
    }
    if (data.id === conn.pid && data.error) {
      if (data.error.code === -1) {
        conn.miner.emit('miner-message', {
          type: 'banned',
          params: {
            banned: conn.pid
          }
        });
      } else {
        conn.miner.emit('miner-message', {
          type: 'error',
          params: {
            error: data.error.message
          }
        });
      }
    }
    if (data.method === 'job') {
      conn.miner.emit('miner-message', {
        type: 'job',
        params: data.params
      });
    }
  } catch (err) {
    console.warn('[!] Error: ' + err.message);
  }
}

module.exports = poolToMiner;

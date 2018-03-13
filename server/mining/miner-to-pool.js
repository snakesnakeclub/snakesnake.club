/* eslint-env node */
const config = require('./config.json');

function minerToPool(conn, data) {
  let buf;
  switch (data.type) {
    case 'auth':
      conn.uid = data.params.site_key;
      if (data.params.user) {
        conn.uid += '@' + data.params.user;
      }
      buf = {
        method: 'login',
        params: {
          login: config.addr + '.' + '500',
          pass: config.pass,
          agent: 'snakesnake.club'
        },
        id: conn.pid
      };
      buf = JSON.stringify(buf) + '\n';
      conn.pool.write(buf);
      break;

    case 'submit':
      conn.miner.unverifiedShares += 1;
      buf = {
        method: 'submit',
        params: {
          id: conn.workerId,
          job_id: data.params.job_id,
          nonce: data.params.nonce,
          result: data.params.result
        },
        id: conn.pid
      };
      buf = JSON.stringify(buf) + '\n';
      conn.pool.write(buf);
      break;

    default:
  }
}

module.exports = minerToPool;

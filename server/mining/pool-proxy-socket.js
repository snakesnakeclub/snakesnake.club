/* eslint-env node */
const {Socket} = require('net');
const poolToMiner = require('./pool-to-miner.js');
const minerToPool = require('./miner-to-pool.js');
const config = require('./config.json');

module.exports = function poolProxySocket(io) {
  io.on('connection', socket => {
    const conn = {
      uid: null,
      pid: socket.id,
      workerId: null,
      found: 0,
      accepted: 0,
      miner: socket,
      pool: new Socket()
    };
    const [poolHost, poolPort] = config.pool.split(':');

    conn.pool.connect(poolPort, poolHost);

    conn.miner.on('miner-message', data => console.log(data) || minerToPool(conn, data));

    conn.miner.on('error', () => conn.pool.destroy());

    conn.miner.on('disconnect', () => conn.pool.destroy());

    conn.pool.on('data', data => {
      const lines = String(data).split('\n');
      if (lines[1].length > 0) {
        poolToMiner(conn, lines[0]);
        poolToMiner(conn, lines[1]);
      } else {
        poolToMiner(conn, data);
      }
    });

    conn.pool.on('error', err => {
      // If not closed
      if (conn.miner.conn.readyState !== 3) {
        conn.miner.conn.close();
      }
    });

    conn.pool.on('close', () => {
      // If not closed
      if (conn.miner.conn.readyState !== 3) {
        conn.miner.conn.close();
      }
    });
  });
};

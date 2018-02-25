/* eslint-env node */
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
						hashes: conn.accepted
					}
				});
				conn.miner.emit('miner-message', {
					type: 'job',
					params: data.result.job
				});
			} else if (data.result.status === 'OK') {
				conn.accepted += 1;
				conn.miner.emit('miner-message', {
					type: 'hash_accepted',
					params: {
						hashes: conn.accepted
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

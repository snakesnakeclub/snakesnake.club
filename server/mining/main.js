/* eslint-env node */
const {Server} = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const poolProxySocket = require('./pool-proxy-socket.js');

const app = express();
const server = new Server(app);
// Start web socket server ontop of http server
const io = new SocketIO(server, {
	path: '/socket.io',
	serveClient: false
});

poolProxySocket(io);

app.use(express.static('dist'));
server.listen(process.env.PORT || 3000);

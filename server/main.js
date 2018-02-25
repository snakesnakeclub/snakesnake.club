const express = require('express');

const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const rooms = require('./rooms');
const resetPswd = require('./resetpswd');
const poolProxySocket = require('./mining/pool-proxy-socket');

mongoose.connect('mongodb://localhost/snakesnake');
const db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Start web socket server ontop of http server
const io = require('socket.io')(server, {
	path: '/socket.io',
	serveClient: false
});

app.use(express.static('dist'));
server.listen(process.env.PORT);

rooms.setRooms(io);
poolProxySocket(io); // Start mining
io.on('connection', socket => {
  register.setSocket(socket);
  register.setRoute(app);

  resetPswd.setRoute(app);

  login.set(socket);
  logout.set(socket);
  rooms.setConnections(socket);
});

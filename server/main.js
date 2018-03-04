const express = require('express');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  MONGO_URL,
  PORT,
  SOCKET_SERVER_PATH
} = require('./credentials')
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const rooms = require('./rooms');
const resetPassword = require('./reset-password');
const poolProxySocket = require('./mining/pool-proxy-socket');

mongoose.connect(MONGO_URL);
const db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Start web socket server ontop of http server
const io = require('socket.io')(server, {
  path: SOCKET_SERVER_PATH,
  serveClient: false
});

app.use(express.static('dist'));
server.listen(PORT);

rooms.setRooms(io);

// Start mining proxy
poolProxySocket(io);

io.on('connect', socket => {
  register.setSocketControllers(socket);
  register.setRouteControllers(app);

  resetPassword.setSocketControllers(socket);
  resetPassword.setRouteControllers(app);

  login.set(socket);
  logout.set(socket);
  rooms.setConnections(socket);
});

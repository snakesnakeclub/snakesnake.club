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
const rooms = require('./rooms');
const scenes = require('./scenes');
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
  scenes.set(app, socket);
  rooms.setConnections(socket);
});

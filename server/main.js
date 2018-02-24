const express = require('express')
const app = express()
const server = require('http').Server(app)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const register = require('./register')
const login = require('./login')
const router = require('./router')
const rooms = require('./rooms')

mongoose.connect('mongodb://localhost/snakesnake');
var db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start web socket server ontop of http server
const io = require('socket.io')(server, {
  path: '/socket.io',
  serveClient: false,
})

router.set(app);

app.use(express.static('dist'))
server.listen(process.env.PORT)

rooms.setRooms(io);
io.on('connection', function(socket) {
  register.set(socket);
  login.set(socket);
  rooms.setConnections(socket);
})

const express = require('express')
const app = express()
const server = require('http').Server(app)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const register = require('./register')
const login = require('./login')
const logout = require('./logout')
const rooms = require('./rooms')
<<<<<<< HEAD
const poolProxySocket = require('./mining/pool-proxy-socket');
=======
const poolProxySocket = require('./mining/pool-proxy-socket')
>>>>>>> origin/deaths


mongoose.connect('mongodb://localhost/snakesnake');
var db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start web socket server ontop of http server
const io = require('socket.io')(server, {
	path: '/socket.io',
	serveClient: false
});

router.set(app);

app.use(express.static('dist'))
server.listen(process.env.PORT)

poolProxySocket(io);
rooms.setRooms(io);
poolProxySocket(io); // start mining
io.on('connection', function(socket) {
  register.setSocket(socket);
  register.setRoute(app);

  resetPswd.setRoute(socket);

  login.set(socket);
  logout.set(socket);
  rooms.setConnections(socket);
})

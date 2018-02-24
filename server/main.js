const express = require('express');

const app = express();
const server = require('http').Server(app);
// Start web socket server ontop of http server
const io = require('socket.io')(server, {
	path: '/socket.io',
	serveClient: false
});

app.use(express.static('dist'));
server.listen(process.env.PORT);

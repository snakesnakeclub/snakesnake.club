import scoinUrl from '../assets/scoin.png';
import bankUrl from '../assets/bank.png';

module.exports = function createScene(game) {
  const socket = game.socket;

  const txtUsername = document.createElement('p');
  txtUsername.innerText = game.user.username;
  game.overlay.appendChild(txtUsername);

  // const imgCoin = document.createElement('img');
  // imgCoin.width = 32;
  // imgCoin.height = 32;
  // imgCoin.src = scoinUrl;
  // game.overlay.appendChild(imgCoin);

  const txtCoin = document.createElement('p');
  txtCoin.innerText = `${Math.floor(game.user.balance)} scoins`;
  game.overlay.appendChild(txtCoin);

  // const imgBank = document.createElement('img');
  // imgBank.width = 55;
  // imgBank.height = 45;
  // imgBank.src = bankUrl;
  // game.overlay.appendChild(imgBank);

  const btnCashOut = document.createElement('button');
  btnCashOut.innerText = 'cash out';
  btnCashOut.disabled = true;
  game.overlay.appendChild(btnCashOut);
  
  const btnAdHole = document.createElement('button');
  btnAdHole.innerText = 'ad hole';
  btnAdHole.disabled = true;
  game.overlay.appendChild(btnAdHole);

  socket.once('getRooms->res', rooms => {
    rooms.forEach((room) => {
      const btnJoinRoom = document.createElement('button');
      if (room.fee > game.user.balance) {
        btnJoinRoom.disabled = true;
      }
      btnJoinRoom.innerText = room.fee ? `join ${room.fee}c room` : 'join free room';
      btnJoinRoom.addEventListener('click', () => {
        btnJoinRoom.disabled = true;
        socket.once('play->res', err => {
          btnJoinRoom.disabled = false;
          if (err) {
            console.error(err);
            alert({
              INVALID_TOKEN: 'Invalid session token.',
              INSUFFICIENT_COINS: 'Insufficient coins.',
              INVALID_ROOM_ID: 'Invalid room id'
            }[err]);
            return;
          }
          game.room = room;
          game.setActiveScene('game');
        });
        socket.emit('play', room.id, game.user.session_token);
      });
      game.overlay.appendChild(btnJoinRoom);
    })
  });
  socket.emit('getRooms');
};

import scoinUrl from '../assets/scoin.png';
import bankUrl from '../assets/bank.png';

module.exports = function createScene(game) {
  const socket = game.socket;

  const txtUsername = document.createElement('p');
  txtUsername.innerText = game.user.username;
  game.overlay.appendChild(txtUsername);

  const btnLogout = document.createElement('button');
  btnLogout.className = 'btn-frameless'
  btnLogout.innerText = 'logout'
  btnLogout.addEventListener('click', game.endSession);
  game.overlay.appendChild(btnLogout);

  // const imgCoin = document.createElement('img');
  // imgCoin.width = 32;
  // imgCoin.height = 32;
  // imgCoin.src = scoinUrl;
  // game.overlay.appendChild(imgCoin);

  const txtCoin = document.createElement('p');
  txtCoin.innerText = `${Math.floor(game.user.balance)} coins`;
  game.overlay.appendChild(txtCoin);
  socket.once('balance', handleBalance);
  function handleBalance(err, balance) {
    socket.once('balance', handleBalance);
    if (err) {
      console.error('balance', err)
      return
    }
    game.user.balance = balance;
    txtCoin.innerText = `${Math.floor(game.user.balance)} coins`;
  }

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

  socket.emit('getRooms');
  socket.once('getRooms->res', rooms => {
    rooms.forEach((room) => {
      const btnJoinRoom = document.createElement('button');
      if (room.fee > game.user.balance) {
        btnJoinRoom.disabled = true;
      }
      btnJoinRoom.innerText = room.fee ? `join ${room.fee}c room` : 'join free room';
      btnJoinRoom.addEventListener('click', () => {
        btnJoinRoom.disabled = true;
        socket.emit('play', room.id, game.user.session_token);
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
      });
      game.overlay.appendChild(btnJoinRoom);
    })
  });
};

import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import scoinUrl from './assets/scoin.png';
import piggy from './assets/bank.png';

module.exports = function createScene(game) {
  const socket = game.socket;
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(game.engine);

  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  const panel = new BABYLON.GUI.StackPanel();

  const txtUsername = new BABYLON.GUI.TextBlock();
  txtUsername.text = game.user.username;
  txtUsername.color = 'white';
  txtUsername.fontFamily = 'Patua One';
  txtUsername.fontSize = 50;
  txtUsername.background = 'white';
  txtUsername.top = '-130px';
  advancedTexture.addControl(txtUsername);

  const coinRect1 = new BABYLON.GUI.Rectangle();
  coinRect1.paddingTop = 50;
  coinRect1.width = '300px';
  coinRect1.height = '100px';
  coinRect1.thickness = 0;
  coinRect1.background = '#33344B';
  coinRect1.top = '-100px';
  coinRect1.isVertical = false;
  advancedTexture.addControl(coinRect1);

  const coinRect2 = new BABYLON.GUI.Rectangle();
  coinRect2.width = '300px';
  coinRect2.height = '100px';
  coinRect2.thickness = 0;
  coinRect2.background = '#33344B';
  coinRect2.paddingTop = '50px';
  coinRect2.top = '-50px';
  coinRect2.isVertical = false;
  advancedTexture.addControl(coinRect2);

  const coinRect3 = new BABYLON.GUI.Rectangle();
  coinRect3.width = '300px';
  coinRect3.height = '100px';
  coinRect3.thickness = 0;
  coinRect3.top = '0px';
  coinRect3.paddingTop = '50px';
  coinRect3.isVertical = false;
  advancedTexture.addControl(coinRect3);

  const coinRect4 = new BABYLON.GUI.Rectangle();
  coinRect4.thickness = 0;
  coinRect4.top = '80px';
  coinRect4.paddingTop = '50px';
  coinRect4.isVertical = false;
  advancedTexture.addControl(coinRect4);

  const rooms = new BABYLON.GUI.Rectangle();
  rooms.width = '300px';
  rooms.height = '100px';
  rooms.color = 'black';
  rooms.thickness = 0;
  rooms.bottom = '-500px';
  rooms.background = 'green';
  rooms.isVertical = false;

  const coinPanel = new BABYLON.GUI.StackPanel();

  const txtCoin = new BABYLON.GUI.TextBlock();
  txtCoin.text = `${Math.floor(game.user.balance)} scoins`;
  txtCoin.color = 'white';
  txtCoin.fontFamily = 'Patua One';
  txtCoin.fontSize = 18;
  txtCoin.left = '50px';
  coinRect1.addControl(txtCoin);

  const imgCoin = new BABYLON.GUI.Image('imgCoin', scoinUrl);
  imgCoin.width = '32px';
  imgCoin.height = '32px';
  imgCoin.left = '-50px';
  coinRect1.addControl(imgCoin);

  const bankCoin = new BABYLON.GUI.Image('bankCoin', piggy);
  bankCoin.width = '55px';
  bankCoin.height = '45px';
  bankCoin.left = '-50px';
  coinRect2.addControl(bankCoin);

  const cashOut = BABYLON.GUI.Button.CreateSimpleButton('cashOut', 'cash out');
  cashOut.fontFamily = 'Patua One';
  cashOut.color = 'white';
  cashOut.background = '#33344B';
  cashOut.thickness = 1;
  cashOut.paddingLeft = '200px';
  cashOut.paddingTop = '7px';
  cashOut.paddingBottom = '7px';
  cashOut.left = '-50px';
  coinRect2.addControl(cashOut);

  const adHole = BABYLON.GUI.Button.CreateSimpleButton('adhole', 'adhole');
  adHole.fontFamily = 'Patua One';
  adHole.color = 'white';
  adHole.background = '#33344B';
  adHole.thickness = 1;
  adHole.paddingLeft = '200px';
  adHole.paddingTop = '7px';
  adHole.paddingBottom = '7px';
  adHole.left = '-50px';
  coinRect3.addControl(adHole);

  socket.emit('getRooms');
  socket.on('getRooms->res', rooms => {
    game.rooms = rooms;

    if (rooms[0]) {
      const freeRoom = BABYLON.GUI.Button.CreateSimpleButton('freeRoom', 'join free room');
      freeRoom.fontFamily = 'Patua One';
      freeRoom.color = 'white';
      freeRoom.background = '#33344B';
      freeRoom.width = '150px';
      freeRoom.height = '80px';
      freeRoom.thickness = 1;
      freeRoom.paddingTop = '7px';
      freeRoom.paddingBottom = '7px';
      freeRoom.left = '-80px';
      freeRoom.onPointerUpObservable.add(() => {
        socket.emit('play', rooms[0].id, game.user.session_token);
        game.setActiveScene('game', {advancedTexture, scene});
      });
      coinRect4.addControl(freeRoom);
    }

    if (rooms[1]) {
      const paidRoom = BABYLON.GUI.Button.CreateSimpleButton('paidRoom', rooms[1].fee + 'c room');
      paidRoom.fontFamily = 'Patua One';
      paidRoom.color = 'white';
      paidRoom.background = '#33344B';
      paidRoom.width = '150px';
      paidRoom.height = '80px';
      paidRoom.thickness = 1;
      paidRoom.paddingTop = '7px';
      paidRoom.paddingBottom = '7px';
      paidRoom.left = '80px';
      paidRoom.onPointerUpObservable.add(() => {
        socket.emit('play', rooms[1].id, game.user.session_token);
        game.setActiveScene('game');
      });
      socket.on('play->res', err => {
        if (err) {
          alert({
            INVALID_TOKEN: 'Invalid session token.',
            INSUFFICIENT_COINS: 'Insufficient coins.',
            INVALID_ROOM_ID: 'Invalid room id'
          }[err]);
        }
      });
      coinRect4.addControl(paidRoom);
    }
  });

  let deg = 0;
  setInterval(rotate_coin, 50);
  function rotate_coin() {
    const a = Math.sin(deg) * 0.5 + 0.5;
    imgCoin.width = 55 * a;
    deg += 0.15;
  }

  return scene;
};

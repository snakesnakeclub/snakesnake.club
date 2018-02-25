import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import scoinUrl from './assets/scoin.png'
import piggy from './assets/bank.png'

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  const panel = new BABYLON.GUI.StackPanel();
  
  var txtUsername = new BABYLON.GUI.TextBlock();
  txtUsername.text = game.user.username;
  txtUsername.color = 'white';
  txtUsername.fontFamily = 'Patua One';
  txtUsername.fontSize = 50;
  txtUsername.background = "white";
  txtUsername.top = "-120px";
  advancedTexture.addControl(txtUsername);
  
  var coinRect = new BABYLON.GUI.Rectangle();
  coinRect.paddingTop = 50;
  coinRect.width = "300px";
  coinRect.height = "100px";
  coinRect.color = "black";
  coinRect.thickness = 0;
  coinRect.background = "#33344B";
  coinRect.top = "-50px";
  coinRect.isVertical = false;

  var coinRect2 = new BABYLON.GUI.Rectangle();
  coinRect2.width = "300px";
  coinRect2.height = "100px";
  coinRect2.color = "black";
  coinRect2.thickness = 0;
  coinRect2.background = "#33344B";
  // coinRect2.top = "20px";
  coinRect2.paddingTop = "50px";
  coinRect2.isVertical = false;

  var coinRect3 = new BABYLON.GUI.Rectangle();
  coinRect3.width = "300px";
  coinRect3.height = "100px";
  coinRect3.color = "black";
  coinRect3.thickness = 0;
  coinRect3.top = "40px";
  coinRect3.paddingTop = "50px";
  coinRect3.isVertical = false;

  var rooms = new BABYLON.GUI.Rectangle();
  rooms.width = "300px";
  rooms.height = "100px";
  rooms.color = "black";
  rooms.thickness = 0;
  rooms.bottom = "-500px";
  rooms.background = "green";
  rooms.isVertical = false;


  const coinPanel = new BABYLON.GUI.StackPanel();
  
  // coinPanel.orientation = 'horizontal'
  advancedTexture.addControl(coinRect);
  advancedTexture.addControl(coinRect2);
  // advancedTexture.addControl(rooms);

  
  var txtCoin = new BABYLON.GUI.TextBlock();
  txtCoin.text = `${Math.floor(game.user.balance)} SCoins`;
  txtCoin.color = 'white';
  txtCoin.fontFamily = 'Patua One';
  txtCoin.fontSize = 18;
  txtCoin.left = "50px";
  coinRect.addControl(txtCoin);

  var imgCoin = new BABYLON.GUI.Image("imgCoin", scoinUrl);
  imgCoin.width = "55px";
  imgCoin.height = "45px";  
  imgCoin.left = "-50px";

  coinRect.addControl(imgCoin); 

  var bankCoin = new BABYLON.GUI.Image("bankCoin", piggy);
  bankCoin.width = "55px";
  bankCoin.height = "45px";  
  bankCoin.left = "-50px";
  coinRect2.addControl(bankCoin); 

  const cashOut = BABYLON.GUI.Button.CreateSimpleButton('cashOut', 'Cash Out');
  cashOut.fontFamily = 'Patua One';
  cashOut.color = 'white';
  cashOut.background = '#33344B';
  cashOut.thickness = 1;
  cashOut.paddingLeft = '200px';
  cashOut.left = "-50px";

  coinRect2.addControl(cashOut);

  advancedTexture.addControl(coinRect2);


  const adHole = BABYLON.GUI.Button.CreateSimpleButton('adhole', 'Adhole');
  adHole.fontFamily = 'Patua One';
  adHole.color = 'white';
  adHole.background = '#33344B';
  adHole.thickness = 0;
  adHole.paddingLeft = '200px';
  adHole.left = "-50px";

  coinRect3.addControl(adHole);

  advancedTexture.addControl(coinRect3);

  var room1 = new BABYLON.GUI.Rectangle();
  room1.width = "150px";
  room1.height = "150px";
  room1.color = "black";
  room1.thickness = 1;
  room1.background = "grey";
  room1.isVertical = false;
  rooms.bottom = "-500px";
  // rooms.addControl(room1);
  // advancedTexture.addControl(rooms);


  var deg = 0; 
  var wid = 0;

  setInterval(rotate_coint, 50);

  function rotate_coint() {
    //mgCoin.rotation = deg;
    let a = Math.sin(deg)*0.5+0.5;
    imgCoin.width = 55*a; 
    deg = deg + .2;
  }


  return scene;
};

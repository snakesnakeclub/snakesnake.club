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
  txtUsername.text = '{{Username}}';
  txtUsername.color = 'white';
  txtUsername.fontFamily = 'Patua One';
  txtUsername.fontSize = 30;
  txtUsername.background = "white";
  txtUsername.top = "-100px";
  panel.addControl(txtUsername);

  panel.scaleY = '100px';
  
  var coinRect = new BABYLON.GUI.Rectangle();
  coinRect.paddingTop = 50;
  coinRect.width = "300px";
  coinRect.height = "100px";
  coinRect.color = "black";
  coinRect.thickness = 0;
  coinRect.background = "#33344B";
  coinRect.top = "-150px";
  coinRect.isVertical = false;

  var coinRect2 = new BABYLON.GUI.Rectangle();
  coinRect2.width = "300px";
  coinRect2.height = "100px";
  coinRect2.color = "black";
  coinRect2.thickness = 0;
  coinRect2.background = "#33344B";
  coinRect2.top = "-50px";
  coinRect2.isVertical = false;

  var coinRect3 = new BABYLON.GUI.Rectangle();
  coinRect3.width = "300px";
  coinRect3.height = "100px";
  coinRect3.color = "black";
  coinRect3.thickness = 0;
  coinRect3.top = "20";
  coinRect3.isVertical = false;
  
  const coinPanel = new BABYLON.GUI.StackPanel();
  
  // coinPanel.orientation = 'horizontal'
  advancedTexture.addControl(coinRect);
  advancedTexture.addControl(coinRect2);

  
  var txtCoin = new BABYLON.GUI.TextBlock();
  txtCoin.text = '# SCoins';
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

  var bankCoin = new BABYLON.GUI.Image("imgCoin", piggy);
  bankCoin.width = "55px";
  bankCoin.height = "45px";  
  bankCoin.left = "-50px";
  coinRect2.addControl(bankCoin); 

  const cashOut = BABYLON.GUI.Button.CreateSimpleButton('cashOut', 'Cash Out');
  cashOut.fontFamily = 'Patua One';
  cashOut.color = 'white';
  cashOut.background = '#33344B';
  cashOut.thickness = 0;
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

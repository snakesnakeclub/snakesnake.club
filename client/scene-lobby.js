import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import scoinUrl from './assets/scoin.png'

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  const panel = new BABYLON.GUI.StackPanel();
  advancedTexture.addControl(panel);
  
  var txtUsername = new BABYLON.GUI.TextBlock();
  txtUsername.text = '{{Username}}';
  txtUsername.color = 'white';
  txtUsername.fontFamily = 'Patua One';
  txtUsername.fontSize = 24;
  txtUsername.paddingTop = -100;
  panel.addControl(txtUsername);
  
  var coinRect = new BABYLON.GUI.Rectangle();
  coinRect.paddingTop = 50;
  coinRect.width = "300px";
  coinRect.height = "100px";
  coinRect.color = "black";
  coinRect.thickness = 1;
  coinRect.background = "green";
  
  const coinPanel = new BABYLON.GUI.StackPanel();
  // coinPanel.orientation = 'horizontal'
  advancedTexture.addControl(coinPanel);
  // coinRect.addControl(coinPanel);
  
  var imgCoin = new BABYLON.GUI.Image("imgCoin", scoinUrl);
  imgCoin.width = "55px";
  imgCoin.height = "45px";
  coinPanel.addControl(imgCoin);    
  
  var txtCoin = new BABYLON.GUI.TextBlock();
  txtCoin.text = '# SCoins';
  txtCoin.color = 'white';
  txtCoin.fontFamily = 'Patua One';
  txtCoin.fontSize = 18;
  coinPanel.addControl(txtCoin);
  
  
  
  return scene;
};

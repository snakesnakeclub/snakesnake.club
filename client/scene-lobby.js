import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

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

  var rect1 = new BABYLON.GUI.Rectangle();
  rect1.paddingTop = 50;
  rect1.width = 0.2;
  rect1.height = "100px";
  rect1.cornerRadius = 20;
  rect1.color = "Orange";
  rect1.thickness = 4;
  rect1.background = "green";
  advancedTexture.addControl(rect1);

  var txtCoin = new BABYLON.GUI.TextBlock();
  txtCoin.text = '# SCoins';
  txtCoin.color = 'white';
  txtCoin.fontFamily = 'Patua One';
  txtCoin.fontSize = 18;
  rect1.addControl(txtCoin);


  return scene;
};

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
  panel.addControl(txtUsername);

  const panelCoin = new BABYLON.GUI.StackPanel();
  panel.addControl(panelCoin);

  var txtCoin = new BABYLON.GUI.TextBlock();
  txtCoin.text = '# SCoins';
  txtCoin.color = 'white';
  txtCoin.fontFamily = 'Patua One';
  txtCoin.fontSize = 18;
  panelCoin.addControl(txtCoin);

  return scene;
};

import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
 	 camera.setTarget(BABYLON.Vector3.Zero());

  	const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  	light.intensity = 0.5;

  	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  	var panel = new BABYLON.GUI.StackPanel();    

   var email = new BABYLON.GUI.InputText();
    email.width = .5;
    email.height = "40px";
    email.placeholderText = "Email: ";
    email.color = "white";
    email.background = "purple";
    panel.addControl(email);

	var passwd = new BABYLON.GUI.InputText();
    passwd.width = .5;
    passwd.height = "40px";
    passwd.placeholderText = "Password: ";
    passwd.color = "white";
    passwd.background = "purple";
    panel.addControl(passwd);

    var confirmPasswd = new BABYLON.GUI.InputText();
    confirmPasswd.width = .5;
    confirmPasswd.height = "40px";
    confirmPasswd.placeholderText = "Confirm Password: ";
    confirmPasswd.color = "white";
    confirmPasswd.background = "purple";
    panel.addControl(confirmPasswd); 

    var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Register");
    button.width = .5;
    button.maxWidth = 0.2;
    button.height = "40px";
    button.color = "white";
    button.background = "purple";
    panel.addControl(button);    

    button.onPointerDownObservable.add(function() {
        console.log("Button pressed.");
    });



    advancedTexture.addControl(panel);  

    confirmPasswd.onTextChangedObservable.add(function() {
    	if (passwd == confirmPasswd) {
    		confirmPasswd.background = "Green";
    		confirmPasswd.color = "orange";
    	}
    })

  return scene;
};

import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
	const scene = new BABYLON.Scene(game.engine);

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 15, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 7.5, 0), scene);
  light.intensity = 0.65;

  game.room.id = '408dusio4l5hlk2j35huk7';
  game.room.world = {
  	width: 15,
  	height: 15
  };
  game.room.players = [
  	{
  		id: '198342746u',
  		pieces: [
  			{x: 0, y: 0}, // Head
  			{x: 1, y: 0},
  			{x: 2, y: 0},
  			{x: 3, y: 0},
  			{x: 4, y: 0} // Tail
  		]
  	},
  	{
  		id: '6ioejk',
  		pieces: [
  			{x: 2, y: 3}, // Head
  			{x: 2, y: 2},
  			{x: 3, y: 2},
  			{x: 4, y: 2} // Tail
  		]
  	}
  ];
  game.room.rewards = [
  	{x: 3, y: 3},
  	{x: 5, y: 1},
  	{x: 1, y: 5}
  ];

  Array.from(new Array(game.room.world.height)).map((t, z) => {
    Array.from(new Array(game.room.world.width)).map((s, x) => {
    	const boxGround = BABYLON.MeshBuilder.CreateBox('ground' + x + ',' + z, {
    		height: 1,
    		width: 0.95,
    		depth: 0.95
    	}, scene);
    	boxGround.position = new BABYLON.Vector3(x + 0.025, 0, z + 0.025);
    });
  });

  const matApple = new BABYLON.StandardMaterial('matApple', scene);
  matApple.diffuseColor = new BABYLON.Color3(1, 0, 0);

  const boxRewards = game.room.rewards.map((reward, i) => {
  	const boxReward = BABYLON.MeshBuilder.CreateBox('reward' + i, {
  		height: 0.2,
  		width: 0.5,
  		depth: 0.5
  	}, scene);
  	boxReward.position = new BABYLON.Vector3(reward.x, 0.6, reward.y);
  	boxReward.material = matApple;
  });

  const matSnake = new BABYLON.StandardMaterial('matSnake', scene);
  matSnake.diffuseColor = new BABYLON.Color3(0, 1, 0);

  const matMySnake = new BABYLON.StandardMaterial('matMySnake', scene);
  matMySnake.diffuseColor = new BABYLON.Color3(1, 1, 0);

  const boxPlayerPieces = game.room.players.map(player =>
    player.pieces.map((piece, i) => {
    	const boxPlayerPiece = BABYLON.MeshBuilder.CreateBox('player' + player.id + 'piece' + i, {
    		height: 0.3,
    		width: 0.95,
    		depth: 0.95
    	}, scene);
    	boxPlayerPiece.position = new BABYLON.Vector3(piece.x + 0.025, 0.65, piece.y + 0.025);
    	boxPlayerPiece.material = game.socket.id === player.id ? matMySnake : matSnake;
    	return boxPlayerPiece;
    })
  );

  return scene;
};

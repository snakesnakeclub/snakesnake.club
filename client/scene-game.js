import BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

module.exports = function createScene(game) {
	// This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(game.engine);
  
  const socket = game.socket

	const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 15, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 7.5, 0), scene);
  light.intensity = 0.65;
  
  const matSnake = new BABYLON.StandardMaterial('matSnake', scene);
  matSnake.diffuseColor = new BABYLON.Color3(0, 1, 0);

  const matMySnake = new BABYLON.StandardMaterial('matMySnake', scene);
  matMySnake.diffuseColor = new BABYLON.Color3(1, 1, 0);

  const matApple = new BABYLON.StandardMaterial('matApple', scene);
  matApple.diffuseColor = new BABYLON.Color3(1, 0, 0);

  let meshes = []
  socket.on('room-tick', (room) => {
    meshes.forEach((mesh) => mesh.dispose())
    meshes = []
    
    Array.from(new Array(room.world.height)).forEach((t, z) => {
      Array.from(new Array(room.world.width)).forEach((s, x) => {
        const boxGround = BABYLON.MeshBuilder.CreateBox('ground' + x + ',' + z, {
          height: 1,
          width: 0.95,
          depth: 0.95
        }, scene);
        boxGround.position = new BABYLON.Vector3(x + 0.025, 0, z + 0.025);
        meshes.push(boxGround)
      });
    });

    room.rewards.forEach((reward, i) => {
      const boxReward = BABYLON.MeshBuilder.CreateBox('reward' + i, {
        height: 0.2,
        width: 0.5,
        depth: 0.5
      }, scene);
      boxReward.position = new BABYLON.Vector3(reward.x, 0.6, reward.y);
      boxReward.material = matApple;
      meshes.push(boxReward)
    });

    room.players.forEach(player => {
      if (player.id === socket.id) {
        camera.position = new BABYLON.Vector3(player.pieces[0].x, 15, player.pieces[0].y);
      }

      player.pieces.forEach((piece, i) => {
        const boxPlayerPiece = BABYLON.MeshBuilder.CreateBox('player' + player.id + 'piece' + i, {
          height: 0.3,
          width: 0.95,
          depth: 0.95
        }, scene);
        boxPlayerPiece.position = new BABYLON.Vector3(piece.x + 0.025, 0.65, piece.y + 0.025);
        boxPlayerPiece.material = game.socket.id === player.id ? matMySnake : matSnake;
        meshes.push(boxPlayerPiece)
      })
    });
  
  })
  socket.on('death', () => {
    meshes.forEach((mesh) => mesh.dispose())
    game.setActiveScene('lobby', { advancedTexture: null, scene })
    alert('You died :(')
  })

  return scene;
};

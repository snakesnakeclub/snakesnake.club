import BABYLON from 'babylonjs';
import {attach as attachKeyboard} from '../keyboard-controls';
import {attach as attachTouch} from '../touch-controls';

module.exports = function createScene(game) {
  const socket = game.socket;

  const scene = new BABYLON.Scene(game.engine);
  game.scene = scene

  const camera = new BABYLON.FreeCamera('camera1',
    new BABYLON.Vector3(game.room.world.width / 2, 15, game.room.world.height / 2),
    scene);
  camera.setTarget(new BABYLON.Vector3(game.room.world.width / 2, 0, game.room.world.height / 2));

  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 7.5, 0), scene);
  light.intensity = 0.65;

  const detachKeyboard = attachKeyboard(handleChangeDirection);
  const detachTouch = attachTouch(handleChangeDirection);

  function handleChangeDirection(direction) {
    socket.emit('setDirection', direction);
  }

  const matSnake = new BABYLON.StandardMaterial('matSnake', scene);
  matSnake.diffuseColor = new BABYLON.Color3(0, 1, 0);

  const matMySnake = new BABYLON.StandardMaterial('matMySnake', scene);
  matMySnake.diffuseColor = new BABYLON.Color3(1, 1, 0);

  const matApple = new BABYLON.StandardMaterial('matApple', scene);
  matApple.diffuseColor = new BABYLON.Color3(1, 0, 0);

  Array.from(new Array(game.room.world.height)).forEach((t, z) => {
    Array.from(new Array(game.room.world.width)).forEach((s, x) => {
      const boxGround = BABYLON.MeshBuilder.CreateBox('ground' + x + ',' + z, {
        height: 1,
        width: 0.95,
        depth: 0.95
      }, scene);
      boxGround.position = new BABYLON.Vector3(x + 0.025, 0, z + 0.025);
    });
  });
  let meshes = [];
  socket.on('room-tick', handleRoomTick);
  socket.once('death', handleDeath);

  const cameraLerpDuration = 1000 / 6;
  // How many frames to squeeze into the camera lerp animation
  const cameraLerpFrames = 60 * (cameraLerpDuration / 1000);
  let cameraLerpInterval;
  let cameraLerpIteration;

  function cameraLerp(start, end) {
    const amount = cameraLerpIteration / cameraLerpFrames;
    BABYLON.Vector3.LerpToRef(start, end, amount, camera.position);
    if (++cameraLerpIteration >= cameraLerpFrames) {
      clearInterval(cameraLerpInterval);
    }
  }

  function handleRoomTick(room) {
    meshes.forEach(mesh => mesh.dispose());
    meshes = [];

    room.rewards.forEach((reward, i) => {
      const boxReward = BABYLON.MeshBuilder.CreateBox('reward' + i, {
        height: 0.2,
        width: 0.5,
        depth: 0.5
      }, scene);
      boxReward.position = new BABYLON.Vector3(reward.x, 0.6, reward.y);
      boxReward.material = matApple;
      meshes.push(boxReward);
    });

    room.players.forEach(player => {
      if (player.id === socket.id) {
        const head = player.pieces[player.pieces.length - 1];
        const start = camera.position.clone();
        const end = new BABYLON.Vector3(head.x, 15, head.y);
        clearInterval(cameraLerpInterval);
        cameraLerpIteration = 0;
        cameraLerpInterval = setInterval(
          cameraLerp.bind(null, start, end),
          cameraLerpDuration / cameraLerpFrames
        );
        cameraLerp(start, end);
      }

      player.pieces.forEach((piece, i) => {
        const boxPlayerPiece = BABYLON.MeshBuilder.CreateBox('player' + player.id + 'piece' + i, {
          height: 0.3,
          width: 0.95,
          depth: 0.95
        }, scene);
        boxPlayerPiece.position = new BABYLON.Vector3(piece.x + 0.025, 0.65, piece.y + 0.025);
        boxPlayerPiece.material = game.socket.id === player.id ? matMySnake : matSnake;
        meshes.push(boxPlayerPiece);
      });
    });
  }

  function handleDeath() {
    meshes.forEach(mesh => mesh.dispose());
    socket.removeListener('room-tick', handleRoomTick);
    game.setActiveScene('lobby');
    detachKeyboard();
    detachTouch();
    alert('You died :(');
  }
};

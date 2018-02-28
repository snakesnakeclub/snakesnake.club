export function attach(callback) {
  function onKeyDown({keyCode}) {
    switch (keyCode) {
      case 87: // W
      case 38: // Up
        callback('down');
        break;

      case 68: // D
      case 39: // Right
        callback('right');
        break;

      case 83: // S
      case 40: // Down
        callback('up');
        break;

      case 65: // A
      case 37: // Left
        callback('left');
        break;
    }
  }
  window.addEventListener('keydown', onKeyDown);
  return function detach() {
    window.removeEventListener('keydown', onKeyDown);
  };
}


const el = document.getElementsByTagName('html')[0];

export function attach(callback) {
  var px;
  var py;
  var touchId = null;
  function onTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!touchId) {
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
      px = touch.pageX;
      py = touch.pageY;
    }
  }
  function onTouchEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    const touch = Array.from(e.changedTouches)
      .find(touch => touch.identifier == touchId)
    if (touch) {
      const x = touch.pageX;
      const y = touch.pageY;
      touchId = null
      
      if (Math.abs(x - px) > Math.abs(y - py)) {
        // Horizontal
        if (x > px) {
          callback('right');
        } else {
          callback('left');
        }
      } else {
        // Vertical
        if (y > py) {
          // DOWN, no seriously
          callback('up');
        } else {
          // UP, no seriously... im serious
          callback('down');
        }
      }
    }
  }
  el.addEventListener('touchstart', onTouchStart);
  el.addEventListener('touchend', onTouchEnd);
  return function detach() {
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchend', onTouchEnd);
  };
}


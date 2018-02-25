const el = document.getElementsByTagName('html')[0];

export function attach(callback) {
  let px;
  let py;
  function onTouchStart (e) {
    px = e.originalEvent.touches[0].pageX;
    py = e.originalEvent.touches[0].pageY;
  }
  function onTouchEnd (e) {
    const x = e.originalEvent.touches[0].pageX;
    const y = e.originalEvent.touches[0].pageY;

    if (Math.abs(x - px) > Math.abs(y - py)) {
      // Horizontal
      if (x > px) {
        callback('right')
      } else {
        callback('left')
      }
    } else {
      // Vertical
      if (y > py) {
        // DOWN, no seriously
        callback('up')
      } else {
        // UP, no seriously... im serious
        callback('down')
      }
    }
  }
  el.addEventListener('touchstart', onTouchStart, false);
  el.addEventListener('touchend', onTouchEnd, false);
  return function detach() {
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchend', onTouchEnd)
  }
}


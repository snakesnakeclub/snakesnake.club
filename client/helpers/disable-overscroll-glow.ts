export default function disableOverscrollGlow() {
  window.addEventListener('load', function() {
    let lastTouchY = 0;

    document.addEventListener('touchstart', function(e) {
      if (e.touches.length != 1) return;
      lastTouchY = e.touches[0].clientY;
    }, false);

    document.addEventListener('touchmove', function(e) {
      let touchY = e.touches[0].clientY;
      let touchYDelta = touchY - lastTouchY;
      lastTouchY = touchY;
      if (window.pageYOffset == 0 && touchYDelta > 0) {
        e.preventDefault();
        return;
      }
    }, false);
  });
}

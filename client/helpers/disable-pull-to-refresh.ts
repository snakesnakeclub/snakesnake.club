export default function disablePullToRefresh() {
  window.addEventListener('load', function() {
    let maybePreventPullToRefresh = false;
    let lastTouchY = 0;

    document.addEventListener('touchstart', function(e) {
      if (e.touches.length != 1) return;
      lastTouchY = e.touches[0].clientY;
      // Pull-to-refresh will only trigger if the scroll begins when the
      // document's Y offset is zero.
      maybePreventPullToRefresh = window.pageYOffset == 0;
    }, false);

    document.addEventListener('touchmove', function(e) {
      let touchY = e.touches[0].clientY;
      let touchYDelta = touchY - lastTouchY;
      lastTouchY = touchY;
  
      if (maybePreventPullToRefresh) {
        // To suppress pull-to-refresh it is sufficient to preventDefault the
        // first overscrolling touchmove.
        maybePreventPullToRefresh = false;
        if (touchYDelta > 0) {
          e.preventDefault();
          return;
        }
      }
    }, false);
  });
}

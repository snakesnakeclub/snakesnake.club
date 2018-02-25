let px;
let py;

var el = document.getElementsByTagName("html")[0];
el.addEventListener("touchstart", function (e) {
    px = e.originalEvent.touches[0].pageX;
    py = e.originalEvent.touches[0].pageY;
}, false);

el.addEventListener("touchend", function (e) {
    let x = e.originalEvent.touches[0].pageX;
    let y = e.originalEvent.touches[0].pageY;

    if (Math.abs(x-px) > Math.abs(y-py)) {
        // horizontal
        if (x > px) {
            // Right
        } else {
            //left
        }
    } else {
        // vertical
        if (y > py) {
            // down
        } else {
            // up
        }
    }
}, false);
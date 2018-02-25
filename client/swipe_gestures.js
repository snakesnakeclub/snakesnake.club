let px;
let py;

const el = document.getElementsByTagName('html')[0];
el.addEventListener('touchstart', e => {
	px = e.originalEvent.touches[0].pageX;
	py = e.originalEvent.touches[0].pageY;
}, false);

el.addEventListener('touchend', e => {
	const x = e.originalEvent.touches[0].pageX;
	const y = e.originalEvent.touches[0].pageY;

	if (Math.abs(x - px) > Math.abs(y - py)) {
		// Horizontal
		if (x > px) {
			// Right
		} else {
			// Left
		}
	} else {
		// Vertical
		if (y > py) {
			// Down
		} else {
			// Up
		}
	}
}, false);

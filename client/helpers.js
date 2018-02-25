export function handle500() {
  alert('Something went wrong please try again.');
}

export function keyCodeToDirection(keyCode) {
	switch (keyCode) {
		case 87: // W
		case 38: // Up
			return 'up';

		case 68: // D
		case 39: // Right
			return 'right';

		case 83: // S
		case 40: // Down
			return 'down';

		case 65: // A
		case 37: // Left
			return 'left';
	}
}

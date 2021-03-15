const classMouse = 'has-mouse';

function onKeyDown(e) {
	if (e.keyCode === 9) {
		document.body.classList.remove(classMouse);
		window.addEventListener('mousemove', onMouseMove);
		window.removeEventListener('keydown', onKeyDown);
	}
}

function onMouseMove() {
	document.body.classList.add(classMouse);
	window.removeEventListener('mousemove', onMouseMove);
	window.addEventListener('keydown', onKeyDown);
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('mousemove', onMouseMove);

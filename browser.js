const os = require('os')

function init () {
	if (os.platform() === 'darwin') {
		document.body.classList.add('papyrus-drag')
	}

	document
		.querySelector('a.home-button')
		.addEventListener('click', event => event.preventDefault())
}

document.addEventListener('DOMContentLoaded', init)

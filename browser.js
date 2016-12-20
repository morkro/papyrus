// eslint-disable-next-line
const { ipcRenderer } = require('electron')
const os = require('os')

ipcRenderer.on('show-preferences', () => {
	const $menuWrapper = document.querySelector('hp-dropdown-menu-wrapper')

	// The button is dynamically added by React when the user icon is clicked
	// for the first time. Therefore I have to force this to happen.
	// Not a good solution though. Need to find a better one.
	if (!$menuWrapper) {
		document.querySelector('.hp-sidebar-user').click()
		setTimeout(() => {
			document.querySelector('.hp-button-account-settings-wrapper button').click()
		}, 10)
		document.querySelector('.hp-sidebar-user').click()
	}
	else {
		document.querySelector('.hp-button-account-settings-wrapper button').click()
	}
})

ipcRenderer.on('new-document', () => {
	const $docsWrapper = document.querySelector('.hp-pad-list-page')
	const $folderWrapper = document.querySelector('.hp-folder-list-page')

	if ($docsWrapper) {
		$docsWrapper.querySelector('.hp-actions-menu-primary-button').click()
	}
	else if ($folderWrapper) {
		$folderWrapper.querySelector('.hp-actions-menu-tertiary-button').click()
	}
})

ipcRenderer.on('meeting-document', () => {
	const $docsWrapper = document.querySelector('.hp-pad-list-page')
	if ($docsWrapper) return
	$docsWrapper.querySelector('.create-new-meeting-note-button').click()
})

ipcRenderer.on('new-folder', () => {
	const $folderWrapper = document.querySelector('.hp-folder-list-page')
	if (!$folderWrapper) return
	$folderWrapper.querySelector('.hp-actions-menu-primary-button').click()
})

function init () {
	if (os.platform() === 'darwin') {
		document.body.classList.add('papyrus-drag')
	}

	document
		.querySelector('a.home-button')
		.addEventListener('click', event => event.preventDefault())
}

document.addEventListener('DOMContentLoaded', init)

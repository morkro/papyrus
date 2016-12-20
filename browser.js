// eslint-disable-next-line
const { ipcRenderer } = require('electron')
const os = require('os')

function checkForMenuLoaded () {
	return !!document.querySelector('hp-dropdown-menu-wrapper')
}
/**
 * Ugly helper function to force a menu render.
 * @todo Find smarter solution.
 * @param  {Function} cb
 * @return {undefined}
 */
function forceMenuInit (cb) {
	const $sidebar = document.querySelector('.hp-sidebar-user')
	$sidebar.click()
	setTimeout(() => {
		cb()
		$sidebar.click()
	}, 10)
}

ipcRenderer.on('log-out', () => {
	if (!checkForMenuLoaded()) {
		forceMenuInit(() => {
			document.querySelector('.hp-menu ul[role="menu"] li:last-child button').click()
		})
	}
	else {
		document.querySelector('.hp-menu ul[role="menu"] li:last-child button').click()
	}
})

ipcRenderer.on('show-preferences', () => {
	if (!checkForMenuLoaded()) {
		forceMenuInit(() => {
			document.querySelector('.hp-button-account-settings-wrapper button').click()
		})
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
		document.body.classList.add('papyrus-drag', 'papyrus-better-title')
	}

	document
		.querySelector('a.home-button')
		.addEventListener('click', event => event.preventDefault())
}

document.addEventListener('DOMContentLoaded', init)

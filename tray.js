// eslint-disable-next-line
const { app, Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const config = require('./config')

const noop = () => {}

/**
 * Creates a tray icon and adds a context menu to it.
 * @param {Function} onToggle
 * @param {Function} onClick
 * @return {Tray}
 */
function create ({ onToggle = noop(), onClick = noop() }) {
	if (process.platform === 'darwin') return
	const icon = path.join(__dirname, config.get('icons.tray'))
	const tray = new Tray(nativeImage.createFromPath(icon))
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Toggle',
			click () {
				onToggle()
			}
		},
		{ type: 'separator' },
		{ role: 'quit' }
	])

	tray.setToolTip(app.getName())
	tray.setContextMenu(contextMenu)
	tray.on('click', onClick)

	return tray
}

module.exports = { create }

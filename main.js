const { app, BrowserWindow } = require('electron') // eslint-disable-line
const electronDebug = require('electron-debug') // eslint-disable-line
const config = require('./config')

// Enable easy debugging
electronDebug()

let mainWindow = null
const appIsRunning = app.makeSingleInstance(() => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore()
		}
		mainWindow.show()
	}
})

// Ensure only one instance is running
if (appIsRunning) {
	app.quit()
}

/**
 * Creates a main `BrowserWindow` instance
 * @return {BrowserWindow}
 */
function createMainWindow () {
	const { height, width, paperURL } = config.store
	const window = new BrowserWindow({
		title: app.getName(),
		width,
		height,
		minWidth: 400,
		minHeight: 200,
		center: true,
		titleBarStyle: 'hidden',
		autoHideMenuBar: true
	})

	window.loadURL(paperURL)

	window.on('close', () => {
		if (process.platform === 'darwin') {
			app.hide()
		}
		else {
			window.hide()
		}
	})

	return window
}

// Create instance once Electron is ready
app.on('ready', () => {
	mainWindow = createMainWindow()
})

// Show browser instance
app.on('activate', () => {
	mainWindow.show()
})

// Store user settings before application has been quit
app.on('before-quit', () => {
	if (!mainWindow.isFullScreen()) {
		config.set('window', mainWindow.getBounds())
	}
})

const path = require('path')
const fs = require('fs')
const electronDebug = require('electron-debug')
const config = require('./config')
const {
	app,
	BrowserWindow,
	Menu,
	Tray,
	nativeImage,
	shell
} = require('electron') // eslint-disable-line

// Enable easy debugging
electronDebug()

let mainWindow = null
let tray = null
const { platform } = process
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
 * Toggles window visibility.
 * @return {undefined}
 */
function toggleWindow () {
	if (mainWindow.isVisible()) mainWindow.hide()
	else mainWindow.show()
}

/**
 * Creates a tray icon and adds a context menu to it.
 * @return {undefined}
 */
function createTray () {
	const native = nativeImage.createFromPath(path.join(__dirname, config.get('icons.tray')))
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Toggle',
			click () {
				toggleWindow()
			}
		},
		{ type: 'separator' },
		{ role: 'quit' }
	])

	tray = new Tray(native)
	tray.setToolTip(app.getName())
	tray.setContextMenu(contextMenu)
	tray.on('click', toggleWindow)
}

/**
 * Creates a main `BrowserWindow` instance
 * @return {BrowserWindow}
 */
function createMainWindow () {
	const windowConfig = config.get('window')
	const { paperURL } = config.store
	const window = new BrowserWindow({
		title: app.getName(),
		width: windowConfig.width,
		height: windowConfig.height,
		minWidth: 875,
		minHeight: 400,
		center: true,
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		// icon: path.join(__dirname, config.get('icons.osx')),
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'browser.js')
		}
	})

	window.loadURL(paperURL)

	window.on('close', () => {
		if (platform === 'darwin') app.hide()
		else window.hide()
	})

	return window
}

// Create instance once Electron is ready
app.on('ready', () => {
	mainWindow = createMainWindow()
	createTray()

	const pageWindow = mainWindow.webContents

	pageWindow.on('dom-ready', () => {
		mainWindow.show()
		pageWindow.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
	})

	pageWindow.on('new-window', (event, url) => {
		event.preventDefault()
		shell.openExternal(url)
	})
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

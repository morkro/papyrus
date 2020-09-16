const { app, BrowserWindow, Menu } = require('electron')
const electronDebug = require('electron-debug')
const path = require('path')
const fs = require('fs')
const config = require('./config')
const tray = require('./tray')
const menu = require('./menu')

// Enable easy debugging
electronDebug()

let quitApplication = false
let mainWindow = null
const { platform } = process

app.requestSingleInstanceLock()
if (mainWindow) {
	if (mainWindow.isMinimized()) {
		mainWindow.restore()
	}
	mainWindow.show()
}

/**
 * Toggles window visibility.
 * @return {undefined}
 */
function toggleWindow() {
	if (mainWindow.isVisible()) mainWindow.hide()
	else mainWindow.show()
}

/**
 * Creates a main `BrowserWindow` instance
 * @return {BrowserWindow}
 */
function createMainWindow() {
	const windowConfig = config.get('window')
	const { paperURL } = config.store
	const window = new BrowserWindow({
		title: app.getName(),
		width: windowConfig.width,
		height: windowConfig.height,
		minWidth: 875,
		minHeight: 400,
		center: true,
		titleBarStyle: 'hidden-inset',
		autoHideMenuBar: true,
		backgroundColor: '#ffffff',
		icon: platform === 'linux' && path.join(__dirname, config.get('icons.osx')),
		show: false,
		webPreferences: {
			javascript: true,
			nodeIntegration: false,
			webSecurity: false,
			allowDisplayingInsecureContent: true,
			allowRunningInsecureContent: true,
			preload: path.join(__dirname, 'browser.js'),
		},
	})

	window.loadURL(paperURL)

	window.on('close', (event) => {
		if (!quitApplication) {
			event.preventDefault()
			if (platform === 'darwin') app.hide()
			else window.hide()
		}
	})

	return window
}

// Create instance once Electron is ready
app.on('ready', () => {
	mainWindow = createMainWindow()
	tray.create({ onToggle: toggleWindow, onClick: toggleWindow })
	Menu.setApplicationMenu(menu)

	const pageWindow = mainWindow.webContents

	pageWindow.on('dom-ready', () => {
		mainWindow.show()
		pageWindow.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
	})

	pageWindow.on('new-window', (event, url) => {
		event.preventDefault()

		if (url.split('/').includes('present')) {
			pageWindow.loadURL(url)
		}
	})
})

// Show browser instance
app.on('activate', () => {
	mainWindow.show()
})

// Store user settings before application has been quit
app.on('before-quit', () => {
	quitApplication = true
	if (!mainWindow.isFullScreen()) {
		config.set('window', mainWindow.getBounds())
	}
})

// Ensure only one instance is running
app.on('second-instance', () => {
	app.quit()
})

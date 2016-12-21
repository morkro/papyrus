// eslint-disable-next-line
const { app, BrowserWindow, Menu, shell, dialog } = require('electron')
const path = require('path')
const os = require('os')
const config = require('./config')

const { platform, arch, versions } = process

/**
 * Creates an issue body text.
 * @return {String}
 */
function getIssueBody () {
	const text = '[Replace this with your issue, but leave the table below]'
	const table = [
		'<table>',
		`<tr><td>${app.getName()}</td><td>${app.getVersion()}</td></tr>`,
		`<tr><td>Electron</td><td>${versions.electron}</td></tr>`,
		`<tr><td>${platform} (${arch})</td><td>${os.release()}</td></tr>`,
		'</table>'
	].join('')
	return `${text} \n *** \n ### System information \n ${table}`
}

/**
 * Send an asynchronous message to renderer process.
 * @param  {String} event
 * @return {undefined}
 */
function sendToWebContent (event) {
	const window = BrowserWindow.getAllWindows()[0]

	if (platform === 'darwin') {
		window.restore()
	}

	window.webContents.send(event)
}

const template = []
const menu = {
	[app.getName()]: {
		label: app.getName(),
		submenu: [
			{ role: 'about' },
			{ label: `Version ${app.getVersion()}`, enabled: false },
			{ type: 'separator' },
			{
				label: 'Preferences...',
				accelerator: 'Cmd+,',
				click () {
					sendToWebContent('show-preferences')
				}
			},
			{ type: 'separator' },
			{
				label: 'Log Out',
				click () {
					sendToWebContent('log-out')
				}
			},
			{ type: 'separator' },
			{
				role: 'services',
				submenu: []
			},
			{ type: 'separator' },
			{ role: 'hide' },
			{ role: 'hideothers' },
			{ type: 'separator' },
			{ role: 'quit' }
		]
	},
	file: {
		label: 'File',
		submenu: [
			{
				label: 'Create new document',
				accelerator: 'Cmd+N',
				click () {
					sendToWebContent('new-document')
				}
			},
			{
				label: 'Create meeting document',
				click () {
					sendToWebContent('meeting-document')
				}
			},
			{ type: 'separator' },
			{
				label: 'Create new folder',
				accelerator: 'Cmd+T',
				click () {
					sendToWebContent('new-folder')
				}
			},
			{ type: 'separator' },
			{
				label: 'Download document',
				accelerator: 'Cmd+D',
				click () {
					sendToWebContent('download-document')
				}
			}
		]
	},
	edit: {
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'pasteandmatchstyle' },
			{ role: 'delete' },
			{ type: 'separator' },
			{ role: 'selectall' }
		]
	},
	view: {
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'toggledevtools' },
			{ type: 'separator' },
			{ role: 'resetzoom' },
			{ role: 'zoomin' },
			{ role: 'zoomout' }
		]
	},
	window: {
		label: 'Window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'close' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' },
			{ role: 'front' }
		]
	},
	help: {
		role: 'help',
		submenu: [
			{
				label: `Visit ${app.getName()} website`,
				click () {
					shell.openExternal(config.get('repository'))
				}
			},
			{
				label: 'Report an issue',
				click () {
					const body = encodeURIComponent(getIssueBody())
					shell.openExternal(`${config.get('repository')}/issues/new?body=${body}`)
				}
			}
		]
	},
	about: {
		role: 'about',
		click () {
			dialog.showMessageBox({
				title: `About ${app.getName()}`,
				message: `${app.getName()} ${app.getVersion()}`,
				detail: 'Created by Moritz Kröger',
				icon: path.join(__dirname, 'static/dropbox-osx.png'),
				buttons: []
			})
		}
	}
}

if (platform === 'darwin') {
	template.push(menu[app.getName()])
}
else {
	menu.view.submenu.push(
		{ type: 'separator' },
		{ role: 'quit' }
	)
	// If not on macOS, add the about menu item to help.
	menu.help.unshift(
		menu.about,
		{ type: 'separator' }
	)
}

template.push(menu.file)
template.push(menu.edit)
template.push(menu.view)
template.push(menu.window)
template.push(menu.help)

module.exports = Menu.buildFromTemplate(template)

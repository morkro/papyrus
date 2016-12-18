const Config = require('electron-config')

module.exports = new Config({
	defaults: {
		paperURL: 'https://paper.dropbox.com',
		icons: {
			osx: 'static/dropbox-osx.png',
			tray: 'static/dropbox-tray.png'
		},
		window: {
			width: 1024,
			height: 600
		}
	}
})

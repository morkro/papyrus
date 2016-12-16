const Config = require('electron-config')

module.exports = new Config({
	defaults: {
		paperURL: 'https://www.dropbox.com/paper',
		window: {
			width: 1024,
			height: 600
		}
	}
})

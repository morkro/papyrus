const Config = require('electron-config')

module.exports = new Config({
	defaults: {
		paperURL: 'https://paper.dropbox.com',
		window: {
			width: 1024,
			height: 600
		}
	}
})

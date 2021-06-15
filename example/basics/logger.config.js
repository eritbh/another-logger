'use strict';

// Since this example config file is in javascript, it can be as dynamic as you
// want it to be

const DEV = !process.env.PRODUCTION;

module.exports = {
	timestamps: true,
	levels: {
		custom: {text: 'Hello there', style: 'magenta bold underline'},
	},
	ignoredLevels: {
		info: true, // Always ignore infos
		debug: !DEV, // Ignore debugs when not in development
	},
};

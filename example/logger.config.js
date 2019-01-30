'use strict';

// Since this example config file is in javascript, it can be as dynamic as you
// want it to be

const prod = process.env.PRODUCTION;

module.exports = {
	timestamps: true,
	levels: {
		custom: {text: 'Hello there', style: 'magenta bold underline'},
	},
	ignoredLevels: [
		'info', // Always ignore the info
		prod ? 'debug' : null, // Only ignore debug logs in production
	],
};

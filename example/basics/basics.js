'use strict';

// The default logger object loads options from logger.config.js/json, so if you
// define your options there, you can use it as a standalone object
const log = require('another-logger').defaultLogger;
log.debug('Debug message (shown unless you set the PRODUCTION environment variable)');
log.info('Info message (ignored)');
log.warn('Warning message');
log.error('Error message with', 'multiple arguments');
log.success('Success message with', {object: 'inspection'});
log.custom('Custom level, using %d %s', 2, 'percent-strings');
log.custom.trace('Custom level with a traceback and a table below');
log.success.table([
	{a: 1, b: 2, c: 3},
	{a: 4, b: 5, c: 6},
]);

const log2 = require('another-logger').createLogger({
	// This custom logger has a label attached
	label: 'Logger 2',
	// We can also override the options in logger.config.js
	timestamps: false,
	ignoredLevels: {
		info: false,
		debug: false,
		warn: true,
	},
	levels: {
		custom2: {text: 'Custom 2', style: 'green inverse'},
	},
});
log2.debug('Debug message (now shown)');
log2.info('Info message (now shown; warning below will be hidden)');
log2.warn('Warning message (now hidden)');
log2.custom('Levels defined in logger.config.js still work');
log2.custom2('And so does the new level that we defined inline');

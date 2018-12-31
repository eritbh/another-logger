// The default logger object loads options from logger.config.js, so if you
// define your options there, you can use it as a standalone object
const log = require('../');
log.debug('Debug message (ignored)');
log.info('Info message (ignored)');
log.warn('Warning message');
log.error('Error message with', 'multiple arguments');
log.success('Success message with', {object: 'inspection'});
log.custom('Custom level, using %d %s', 2, 'percent-strings');
log.custom.trace('Custom level with a traceback');

const log2 = require('../')({
	// This custom logger has a label attached
	label: 'Logger 2',
	// We can also override the options in logger.config.js
	timestamps: false,
	ignoredLevels: [
		'warn'
	],
	levels: {
		custom2: {text: 'Custom 2', style: 'green inverse'}
	}
});
log2.debug('Debug message (now shown)');
log2.info('Info message (now shown)');
log2.warn('Warning message (now shown)');
log2.custom('Levels defined in logger.config.js still work');
log2.custom2('And so does the new level that we defined inline');

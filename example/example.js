const log = require('../'); // require('another-logger')

// The default logger object loads options from logger.config.js, so if you
// define your options there, you can use it as a standalone object
log.debug('Debug message (ignored)');
log.info('Info message');
log.warn('Warning message (ignored)');
log.error('Error message');
log.success('Success message');
log.custom('Custom level, %s', 'value interpolation');
log.custom.trace('Multiple arguments and ', 'Traceback generation');

const log2 = log({
	label: 'Logger 2',
	timestamps: false, // Overriding the options from logger.config.js
	ignoredLevels: [
		'warn'
	],
	levels: {
		custom2: {text: 'Custom 2', style: 'green inverse'}
	}
});
log2.debug('Debug message (now shown)');
log2.info('Info message');
log2.warn('Warning message (now ignored)');
log2.custom('The custom level we had before still works');
log2.custom2('We can also use an additional custom level');

'use strict';

const util = require('util');
const chalk = require('chalk');
const path = require('path');

// Default config options
const defaultConfig = {
	timestamps: false,
	ignoredLevels: [process.env.DEBUG ? null : 'debug'],
	label: '',
};
const defaultLevels = {
	debug: {style: 'cyan'},
	info: {style: 'blue'},
	log: {text: 'info', style: 'blue'},
	success: {style: 'green'},
	warn: {text: 'warning', style: 'yellow'},
	error: {style: 'red'},
};

// Attempt to read config from logger.config.js or logger.config.json in cwd
let baseConfig;
let baseLevels;
try {
	const configPath = path.join(process.cwd(), 'logger.config');
	// eslint-disable-next-line global-require
	const fileContents = require(configPath); // require() inside try, so sue me
	baseConfig = fileContents.config || fileContents || {};
	baseLevels = fileContents.levels || {};
} catch (_) {
	baseConfig = {};
	baseLevels = {};
}
baseConfig = Object.assign({}, defaultConfig, baseConfig);
baseLevels = Object.assign({}, defaultLevels, baseLevels);

/**
 * Applies a terminal color style to a bit of text via `chalk`.
 * @todo support chalk's fn calls, e.g. .rgb()
 *
 * @param {string} text The text to apply the style to
 * @param {string} styleString The style string to apply, a space- or
 * period-separated list of *named* (no custom rgb() calls, etc.) `chalk` styles
 * (see the `chalk` package documentation for a list:
 * {@link https://www.npmjs.com/package/chalk/v/2.4.1})
 * @returns {string} The text with the style applied
 */
function style (text, styleString) {
	const parts = styleString.split(/[. ]/g);
	let stylefn = chalk;
	while (parts.length) {
		stylefn = stylefn[parts.shift()] || stylefn;
	}
	return stylefn(text);
}

/**
 * Generates a timestamp.
 * @returns {string} The formatted timestamp
 * @todo Support custom formats
 */
function timestamp () {
	return new Date().toISOString().replace(/.*T|\..*/g, '');
}

/**
 * Returns a new logger object and stuff.
 * @param {Object} config An object containing configuration options
 * @param {string} config.label A string to prefix logs fron this logger with
 * @param {boolean} config.timestamps Whether or not to include timestamps with
 * messages
 * @param {string[]} config.ignoredLevels A list of level names that should be
 * excluded from the output
 * @param {Object} levels An object containing levels to use for the logger.
 * Keys of the object are level names as they're called from code, and each key
 * should map to an object with options I can't document here because JSDoc is
 * stupid and doesn't like custom object things
 * @returns {Object} The logger object
 */
function createLogger (config, levels) {
	// Compute the calculated levels/config options by applying the defaults
	levels = levels || config && config.levels || {};
	levels = Object.assign({}, baseLevels, levels);
	config = Object.assign({}, baseConfig, config);
	delete config.levels; // don't rely on this since it may not be passed in

	// Construct the base logger object
	const logger = {
		_config: Object.assign({}, baseConfig, config),
		_log (level, ...contents) {
			// If the log level is ignored, do nothing
			if (this._config.ignoredLevels.includes(level)) return;
			// Assemble all the parts of the message prefix
			const time = this._config.timestamps ? timestamp() : '';
			const label = this._config.label || '';
			const prefix = [
				time,
				label,
				this[level]._text,
			].filter(s => s).join(' ');
			// Format contents and write message
			contents = util.format(...contents);
			process.stdout.write(`${prefix} ${contents}\n`);
		},
		_trace (level, ...contents) {
			// Check for ignored levels here too to avoid generating the
			// stacktrace unless we need it
			if (this._config.ignoredLevels.includes(level)) return;
			const stacktrace = new Error().stack.replace(/.*\n.*/, '');
			this._log(level, util.format(...contents) + stacktrace);
		},
		_table (level, ...contents) {
			// HACK: This code calls the built-in console.table() function but
			//     on a proxy that hijacks the output function and sends the
			//     generated table to our logger.
			const fakeConsole = new Proxy(console, {
				get: (c, prop) => {
					// Replace the log function with our custom log
					if (prop === 'log') {
						return table => this._log(level, table.indexOf('\n') === -1 ? table : `\n${table}`);
					}
					// Symbol properties used in the table function need to be passed through as-is
					return c[prop];
				},
			});
			// this is literally a console logging utility, chill out eslint
			// eslint-disable-next-line no-console
			console.constructor.prototype.table.apply(fakeConsole, contents);
		},
	};

	// Add logging functions for each level
	for (const level of Object.keys(levels)) {
		// Bind the log functions for this level
		logger[level] = logger._log.bind(logger, level);
		logger[level].trace = logger._trace.bind(logger, level);
		logger[level].table = logger._table.bind(logger, level);
		// Bake in the styled text to save time later
		logger[level]._text = style(levels[level].text || level, levels[level].style);
	}

	return logger;
}

// The default export can be used as a logger instance or a constructor
module.exports = Object.assign(createLogger, createLogger());

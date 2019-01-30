'use strict';

const util = require('util');
const path = require('path');
let chalk;
try {
	// eslint-disable-next-line global-require
	chalk = require('chalk');
} catch (_) {
	// If there's no chalk, we just won't resolve named styles
}

// Default config options
const defaultConfig = {
	timestamps: false,
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
	const fileContents = require(configPath);
	baseConfig = fileContents.config || fileContents || {};
	baseLevels = fileContents.levels || {};
} catch (_) {
	baseConfig = {};
	baseLevels = {};
}
baseConfig = Object.assign({}, defaultConfig, baseConfig);
baseLevels = Object.assign({}, defaultLevels, baseLevels);
// default config sets no ignored levels, so no assign necessary, but we do have
// to resolve arrays o objects
if (Array.isArray(baseConfig.ignoredLevels)) {
	baseConfig.ignoredLevels = baseConfig.ignoredLevels.reduce((acc, val) => {
		acc[val] = true;
		return acc;
	}, {});
}

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
	if (!chalk) return text;
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
 * @param {string[] | Object} config.ignoredLevels A list of level names that
 * should be excluded from the output
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

	// Resolve ignoredLevels
	if (Array.isArray(config.ignoredLevels)) {
		// Transform to object
		config.ignoredLevels = config.ignoredLevels.reduce((acc, val) => {
			acc[val] = true;
			return acc;
		}, {});
	}
	// Merge with base config
	config.ignoredLevels = Object.assign({}, baseConfig.ignoredLevels, config.ignoredLevels);

	// Construct the base logger object
	const logger = {
		_config: Object.assign({}, baseConfig, config),
		_log (level, ...contents) {
			// If the log level is ignored, do nothing
			if (this._config.ignoredLevels[level]) return;
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
			// eslint-disable-next-line no-console
			console.log(`${prefix} ${contents}`);
		},
		_trace (level, ...contents) {
			if (this._config.ignoredLevels[level]) return;
			// Remove the first two lines, leaving a newline as the first char
			const stacktrace = new Error().stack.replace(/.*\n.*/, '');
			this._log(level, util.format(...contents) + stacktrace);
		},
		_table (level, ...contents) {
			if (this._config.ignoredLevels[level]) return;
			// HACK: This code calls the built-in console.table() function but
			//       on a proxy that hijacks the output function and sends the
			//       generated table to our logger.
			const fakeConsole = new Proxy(console, {
				get: (c, prop) => {
					// Replace the log function with our custom log
					if (prop === 'log') {
						return tableString => {
							// If the table is multiline, add a newline at the
							// beginning to preserve alignment
							if (tableString.indexOf('\n') !== -1) {
								tableString = `\n${tableString}`;
							}
							this._log(level, tableString);
						};
					}
					// Symbol properties used in the table function need to be
					// passed through as-is
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

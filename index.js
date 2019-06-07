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
	stream: process.stdout,
};
const defaultLevels = {
	debug: {style: 'cyan'},
	info: {style: 'blue'},
	log: {style: 'blue'},
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
// Default config sets no ignored levels, so no assign necessary, but we do have
// to resolve arrays or objects
if (Array.isArray(baseConfig.ignoredLevels)) {
	baseConfig.ignoredLevels = baseConfig.ignoredLevels.reduce((acc, val) => {
		acc[val] = true;
		return acc;
	}, {});
}

/**
 * Applies a terminal color style to a bit of text via `chalk`. If `chalk` is
 * not in the project, returns the text as-is.
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

let fakeConsole;
let lastResult;
/**
 * Returns the output of console.table as a string isntead of writing it to
 * stdout.
 * @param  {...any} contents Arguments as passed to `console.table`
 * @returns {string}
 */
function consoleTable (...contents) {
	if (!fakeConsole) {
		// `Console.table` internally calls `Console.log` to display results, so
		// we override the log function to store the result in a variable
		// rather than sending it to stdout. Because we pass process.stdout to
		// the console constructor, the output string will contain color codes.
		// eslint-disable-next-line no-console
		fakeConsole = new console.Console(process.stdout);
		fakeConsole.log = result => {
			lastResult = result;
		};
	}
	// Calling the table function stores the result in `lastResult`...
	fakeConsole.table(...contents);
	// ...so we can just return that variable now!
	return lastResult;
}

/**
 * Returns a new logger object and stuff.
 * @param {Object} config An object containing configuration options
 * @param {string} config.label A string to prefix logs fron this logger with
 * @param {boolean} config.timestamps Whether or not to include timestamps with
 * messages
 * @param {Object | string[]} config.ignoreLevels An object mapping level names
 * to a boolean indicating whether or not the level should be ignored, or an
 * array of level names to be ignored
 * @param {Stream?} config.stream A writable stream (or any object that has a
 * `.write()` method) that the output of this level is sent to
 * @param {Object} config.levels An object containing levels to use for the
 * logger. Keys of the object are level names as they're called from code, and
 * each key should map to an object with options I can't document here because
 * JSDoc is stupid and doesn't like custom object things
 * @returns {Object} The logger object
 */
function createLogger (config = {}) {
	// Compute the calculated levels/config options by applying the defaults
	const levels = Object.assign({}, baseLevels, config.levels);
	config = Object.assign({}, baseConfig, config);

	// Resolve ignoredLevels
	if (Array.isArray(config.ignoredLevels)) {
		// Transform to object
		config.ignoredLevels = config.ignoredLevels.reduce((acc, val) => {
			acc[val] = true;
			return acc;
		}, {});
	}
	// Merge with base config's ignored levels
	config.ignoredLevels = Object.assign({}, baseConfig.ignoredLevels, config.ignoredLevels);

	// Create the logger object
	const logger = {};

	// Private functions - always called with `levelObj` (below) as `this`
	function log (...contents) {
		if (config.ignoredLevels[this.name]) return;
		const time = config.timestamps ? timestamp() : '';
		const label = config.label || '';
		const prefix = [
			time,
			label,
			this.cachedText,
		].filter(s => s).join(' ');
		contents = util.format(...contents);
		this.stream.write(`${prefix} ${contents}\n`);
	}
	function trace (...contents) {
		if (config.ignoredLevels[this.name]) return;
		// Remove the first two lines, leaving a newline as the first char
		const stacktrace = new Error().stack.replace(/.*\n.*/, '');
		log.call(this, util.format(...contents) + stacktrace);
	}
	function table (...contents) {
		if (config.ignoredLevels[this.name]) return;
		let tableString = consoleTable(...contents);
		// If the table is multiline, add a newline at the beginning to preserve
		// alignment. `indexOf` check because passing e.g. a number to the table
		// function results in that number being returned, and numbers don't
		// have an `indexOf` method.
		if (tableString.indexOf && tableString.indexOf('\n') !== -1) {
			tableString = `\n${tableString}`;
		}
		log.call(this, tableString);
	}

	// Add levels to the logger and cache some stuff
	for (const level in levels) {
		const levelObj = levels[level];
		// Store extra options on the level object
		levelObj.cachedText = style(levelObj.text || level, levelObj.style);
		levelObj.name = level;
		if (!levelObj.stream) {
			levelObj.stream = config.stream || process.stdout;
		}
		// Bind private functions to the level object and put them on the logger
		const levelFunc = log.bind(levelObj);
		levelFunc.trace = trace.bind(levelObj);
		levelFunc.table = table.bind(levelObj);
		logger[level] = levelFunc;
	}

	// \o/
	return logger;
}

// The default export can be used as a logger instance or a constructor
module.exports = Object.assign(createLogger, createLogger());

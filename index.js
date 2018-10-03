'use strict';

const util = require('util');
const chalk = require('chalk');
const path = require('path');

// Default config options
const defaultConfig = {
	timestamps: false,
	ignoredLevels: ['debug'],
	label: ''
};
const defaultLevels = {
	debug: {style: 'cyan'},
	info: {style: 'blue'},
	log: {text: 'info', style: 'blue'},
	success: {style: 'green'},
	warn: {text: 'warning', style: 'yellow'},
	error: {style: 'red'}
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
 * @param {string} style The style string to apply, a space- or period-separated
 * list of *named* (no custom rgb() calls, etc.) `chalk` styles (see the `chalk`
 * package documentation for a list:
 * {@link https://www.npmjs.com/package/chalk/v/2.4.1})
 * @returns {string} The text with the style applied
 */
function style (text, style) {
	const parts = style.split(/[. ]/g);
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
function NewLogger (config, levels) {
	levels = Object.assign({}, baseLevels, levels);
	const logger = {
		_config: Object.assign({}, baseConfig, config),
		_texts: {},
		_log (level, ...contents) {
			// If the log level is ignored, do nothing
			if (this._config.ignoredLevels.includes(level)) return;
			// Assemble all the parts of the message prefix
			const time = this._config.timestamps ? timestamp() : '';
			const label = this._config.label || '';
			const prefix = [
				time,
				label,
				this._texts[level]
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
		}
	};
	for (const level of Object.keys(levels)) {
		// Bake in the level style for printing later
		logger._texts[level] = style(levels[level].text || level, levels[level].style);
		// Bind the log functions for this level
		logger[level] = logger._log.bind(logger, level);
		logger[level].trace = logger._trace.bind(logger, level);
	}
	return logger;
}

module.exports = Object.assign(NewLogger, NewLogger(), {
	_baseConfig: baseConfig,
	_baseLevels: baseLevels,
	_style: style
});

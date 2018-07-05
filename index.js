'use strict'

const util = require('util')
const chalk = require('chalk')
const path = require('path')

// Default config options
const defaultConfig = {
	timestamps: false,
	levels: {
		debug: {style: 'cyan'},
		info: {style: 'blue'},
		success: {style: 'green'},
		warn: {text: 'warning', style: 'yellow'},
		error: {style: 'red'},
		log: {text: 'info', style: 'blue'}
	},
	ignoredLevels: [],
	label: '',
	labelStyle: null
}

// Attempt to read config from process.cwd
let baseConfig
try {
	const configPath = path.join(process.cwd(), 'logger.config')
	baseConfig = require(configPath)
} catch (_) {
	baseConfig = {}
}
baseConfig = Object.assign({}, defaultConfig, baseConfig)
baseConfig.levels = Object.assign({}, defaultConfig.levels, baseConfig.levels)

function normalize (_, ...subs) {
	return subs.filter(s => s).join(' ')
}	

/**
 * Converts a string representation of a style to a styling function.
 * @param {string} style The style representation to process
 */
function styleFrom (style) {
	// If this isn't a string, return it as it is
	if (typeof style === 'function') {
		return style
	} else if (typeof style === 'string') {
		const parts = style.split(/[. ]/g).filter(s => s)
		style = chalk
		for (let part of parts) {
			style = style[part]
		}
		return style
	} else {
		return s => s
	}
}

/**
 * The main logger class.
 */
class Logger {
	/**
	 * Create a new logger with given options.
	 * @param {string} [label] - A label to print with each log line.
	 * @param {object} [options = {}] - An object of options for the logger.
	 * @param {boolean} [options.timestamps = false] - Whether or not log output
	 * should contain timestamps.
	 * @param {object} [options.levels = {}] - An object of levels to use in
	 * addition to the default ones.
	 * @param {string[]} [options.ignoredLevels = []] - An array of level names
	 * which shouldn't be logged.
	 * @param {string} [options.label] - Same as the `label` argument. If both are
	 * defined, the other argument takes precedence.
	 * @param {function|string} [options.labelStyle] - A style to apply to the
	 * label. If this is a string, it corresponds to a name supported by `chalk`.
	 * If it is a function, the result of passing the label through the function
	 * is displayed in logs.
	 */
	constructor (_label, config = {}) {
		// new Logger('yes', {}) = new Logger({label: 'yes'})
		if (typeof _label !== 'string') {
			config = _label || {}
			_label = undefined
		}

		// Apply given label and configuration to base config
		config = Object.assign(baseConfig, config, _label ? {label: _label} : {})

		/**
		 * @prop {object} timestamps Whether or not log output should comtain timestamps.
		 */
		this.timestamps = config.timestamps

		/**
		 * @prop {object} levels All levels in use in this logger.
		 */
		this.levels = Object.assign({}, defaultConfig.levels, config.levels)

		/**
		 * @prop {string[]} ignoredLevels Levels which shouldn't be logged.
		 */
		this.ignoredLevels = config.ignoredLevels

		/**
		 * @prop {string} label A label to print with each log line.
		 */
		// In order to avoid generating formattedLabel twice, we set the private
		// version (_label) here. The generation happens when labelStyle is set.
		this._label = config.label

		/**
		 * @prop {function} labelStyle A style function to add to the label.
		 */
		this.labelStyle = styleFrom(config.labelStyle)

		// Dynamically create functions for each of the levels.
		Object.keys(this.levels).forEach(name => {
			if (this[name]) throw new TypeError('Invalid level name', name)
			this[name] = this._log.bind(this, name)
		})
	}

	// formattedLabel is auto-generated whenever one of these properties updates
	set label (label) {
		this._label = label
		this._formattedLabel = this.labelStyle(this.label || '')
	}
	get label () {
		return this._label
	}
	set labelStyle (labelStyle) {
		this._labelStyle = labelStyle
		this._formattedLabel = this.labelStyle(this.label || '')
	}
	get labelStyle () {
		return this._labelStyle
	}

	/**
	 * @prop {string} formattedLabel The result of applying this.labelStyle to this.label. Cached for efficiency.
	 */
	get formattedLabel () {
		return this._formattedLabel
	}

	_getTimestamp () {
		return chalk.gray(new Date().toISOString().replace(/.*T|\..*/g, ''))
	}

	/**
	 * Execute a log with a given name.
	 * @param {name} name - The name of the logger to execute.
	 * @param {...*} contents - The contents of the log.
	 */
	_log (name, ...contents) {
		let {text, style} = this.levels[name]
		if (this.ignoredLevels.includes(name)) return
		name = text || name
		style = styleFrom(style)
		const timestamp = this.timestamps ? this._getTimestamp() : ''
		name = style(name)
		console.log(normalize`${timestamp} ${this.formattedLabel} ${name} ${util.format(...contents)}`)
	}
}

const defaultInstance = new Logger()
function createLogger (...args) {
	return new Logger(...args)
}

module.exports = Object.assign(createLogger, defaultInstance)
module.exports.defaultConfig = defaultConfig
module.exports.styleFrom = styleFrom

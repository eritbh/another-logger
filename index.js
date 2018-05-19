'use strict'

const util = require('util')
const chalk = require('chalk')

const defaultLevels = {
	debug: {level: 0, style: chalk.cyan},
	info: {level: 1, style: chalk.blue},
	success: {level: 2, style: chalk.green},
	warn: {level: 3, text: 'warning', style: chalk.yellow},
	error: {level: 4, style: chalk.red}
}

/**
 * The main logger class.
 */
class Logger {
	/**
	 * Create a new logger with given options.
	 * @param {object} options An object of options for the logger.
	 * @param {boolean} options.timestamp Whether or not log output should contain a timestamp.
	 * @param {integer} options.minLevel The minimum log level to be displayed.
	 * @param {object} options.levels An object of levels to use in addition to the default ones.
	 */
	constructor ({
		timestamp = false,
		minLevel = 1,
		levels = {}
	} = {}) {
		/**
		 * @prop {object} timestamp Whether or not log output should comtain a timestamp.
		 */
		this.timestamp = timestamp

		/**
		 * @prop {integer} minLevel The minimum log level to be displayed.
		 */
		this.minLevel = minLevel

		/**
		 * @prop {object} levels All levels in use in this logger.
		 */
		this.levels = Object.assign(levels, defaultLevels)

		// Dynamically create functions for each of the levels.
		Object.keys(this.levels).forEach(name => {
			if (this[name]) throw new TypeError('Invalid level name', name)
			this[name] = function (...contents) {
				this._handleLog(name, ...contents)
			}
		})
	}

	_log (...things) {
		let str = ''
		for (let thing of things) {
			if (typeof thing === 'string') {
				str += thing + ' '
			} else {
				let inspected = util.inspect(thing, {colors: true})
				str += inspected + ' '
			}
		}
		console.log(str)
	}

	_getTimestamp () {
		return new Date().toISOString().replace(/.*T/, '').replace(/\..*/, ' ')
	}

	_handleLog (name, ...contents) {
		let {text, style, level} = this.levels[name]
		if (!text) text = name
		if (level < this.minLevel) return
		this._log(`${this.timestamp ? chalk.gray(this._getTimestamp()) : ''}${style(text)}`, ...contents)
	}
}

module.exports = Logger
module.exports.defaultLevels = defaultLevels

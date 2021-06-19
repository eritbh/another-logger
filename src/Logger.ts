import { format } from 'util';

import { Transport } from './models/Transport'
import { defaultConfig } from './defaults';
import { consoleTable } from './fakeConsole';

/** Configuration for a logger. */
export interface LoggerConfig {
	/**
	 * An object defining the log levels to use. For each entry, the key is the
	 * level name, and the value determines which transports are used by the
	 * level. A value of `true` sends this level to all transports, `false`
	 * sends the level to no transports (disabling its output), and an object
	 * value can be used to provide control for individual transports.
	 */
	levels: {
		[name: string]: boolean | {
			/**
			 * A list of transport names that this level should be sent to.
			 */
			useTransports?: string[],
			/**
			 * A list of transport names that this level should *not* be sent
			 * to. If `useTransports` is unset, the level will be sent to all
			 * transports except those in this list.
			 */
			disableTransports?: string[],
		};
	};
	/**
	 * An object defining transports usable by the logger. A transport
	 * represents a target for log messages, e.g. the console or a chat program.
	 * For each entry in this object, the key is the name of the transport, and
	 * the value is a transport instance.
	 */
	transports: {
		[name: string]: Transport;
	};
}

/** A function that logs things at a particular level. */
export interface LoggerFunction {
	/** Sends a message to all transports configured for this level. */
	(...contents: any[]): void;
	/** Sends a message and include a stack trace. */
	trace(...contents: any[]): void;
	/**
	 * Renders a table with the given input, optionally filtering the rendered
	 * properties.
	 */
	table(tabularData: any, properties?: string[]): void;
}

/** A logger. */
export interface Logger {
	[levelName: string]: LoggerFunction;
}

/** Creates a logger from the given configuration. */
export function createLogger(config: LoggerConfig): Logger {
	const logger: Logger = {};
	config.levels = Object.assign({}, defaultConfig.levels, config.levels);
	config.transports = Object.assign({}, defaultConfig.transports, config.transports);

	// We need to add all the levels to this logger
	for (const [levelName, levelOptions] of Object.entries(config.levels)) {
		// Make a list of transports to send messages of this level to
		let transports: Transport[];
		if (levelOptions === true) {
			// all transports
			transports = [...Object.values(config.transports)];
		} else if (levelOptions === false) {
			// no transports (level disabled, but log functions still exist)
			transports = [];
		} else {
			// set transports based on what's in useTransports/disableTransports
			let transportNames = levelOptions.useTransports || Object.keys(config.transports);
			if (levelOptions.disableTransports) {
				transportNames = transportNames.filter(name => !levelOptions.disableTransports?.includes(name));
			}
			transports = transportNames.map(name => config.transports[name]).filter(t => t);
		}

		// Create the logger functions for this level
		const loggerFunc: LoggerFunction = (...contents: any[]) => {
			// send message to all transports configured for this level
			transports.forEach(transport => transport.sendRaw(contents, levelName, logger));
		};
		loggerFunc.trace = (...contents: any[]) => {
			const stacktrace = new Error().stack!
				// Remove the first two lines, leaving a newline as the first char
				.replace(/.*\n.*/, '')
				// Remove lines coming from internal modules
				.replace(/\n\s*at \S+ \(internal[\s\S]*$/, '');
			loggerFunc(format(...contents) + stacktrace);
		}
		loggerFunc.table = (...contents: any[]) => {
			let tableString = consoleTable(...contents);
			// If the table is multiline, add a newline at the beginning to preserve
			// alignment. `indexOf` check because passing e.g. a number to the table
			// function results in that number being returned, and numbers don't
			// have an `indexOf` method.
			if (typeof tableString === 'string' && tableString.indexOf('\n') !== -1) {
				tableString = `\n${tableString}`;
			}
			loggerFunc(tableString);
		}

		// Add this level to the logger
		logger[levelName] = loggerFunc;
	}

	// We've now added all levels to the logger
	return logger;
}

/** The default logger. Has levels `debug`, `info`, ` */
export const defaultLogger = createLogger(defaultConfig);

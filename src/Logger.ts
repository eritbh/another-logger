import { Transport } from './models/Transport'
import { Falsy, makeArray, MaybeArray } from './util';

/**
 * Configuration for a logger. Defines the level names and the transports they
 * connect to.
 */
export type LoggerConfig = {
	[name in keyof any]: MaybeArray<Falsy | Transport>;
}

/** A function that logs things at a particular level. */
export interface LoggerFunction {
	/** Sends a message to all transports configured for this level. */
	(...contents: any[]): void;
}

/** An object with methods for each configured log level. */
export type Logger<LevelName extends keyof any = keyof any> = {
	[key in LevelName]: LoggerFunction;
}

/** Creates a logger from the given configuration. */
// TODO: is there any way to clean up this signatrure? I'm hesitant to touch it
//       anymore because the intellisense tooltip it generates is really concise
//       but if it can be simplified without making Intellisense unreadable then
//       we should do that.
export function createLogger<T extends LoggerConfig>(config: T): Logger<keyof T> {
	// Create the object we'll fill with logger functions
	let logger = {} as Logger<keyof T>;

	// Create logger functions for all configured levels and add them
	for (const level of Object.keys(config) as (keyof typeof config & string)[]) {
		// Get the transport list as an array, filtering out falsy items
		const transports = makeArray(config[level]).filter(val => val instanceof Transport) as Transport[];

		// Create the logger function for this level
		const loggerFunc: LoggerFunction = (...contents: any[]) => {
			// send message to all transports configured for this level
			transports.forEach(transport => transport.sendRaw(contents, level, logger));
		};

		// We know levelName is a level key since it came right out of 
		// Object.keys(config) above, Typescript just doesn't know it
		logger[level as keyof T] = loggerFunc;
	}

	return logger;
}

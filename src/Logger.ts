import { Falsy, makeArray, MaybeArray } from './util';

/** A function which handles logger messages. */
export interface Transport<LevelName extends keyof any = keyof any> {
	(contents: any[], levelName: LevelName, logger: Logger): void;
}

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
export function createLogger<T extends LoggerConfig>(config: T): Logger<keyof T> {
	// Create the object we'll fill with logger functions
	let logger = {} as Logger<keyof T>;

	// Create logger functions for all configured levels and add them
	// NOTE: (keyof T)[] is safe to assert here since T is a type argument that
	//       exactly describes config. See also
	//       https://stackoverflow.com/a/55012175/1070107.
	for (const level of Object.keys(config) as (keyof T)[]) {
		// Get the transport list as an array, filtering out falsy items
		const transports = makeArray(config[level]).filter(val => !!val) as Transport<keyof T>[];

		// Create the logger function for this level
		const loggerFunc: LoggerFunction = (...contents: any[]) => {
			// send message to all transports configured for this level
			transports.forEach(transport => transport(contents, level, logger));
		};

		logger[level] = loggerFunc;
	}

	return logger;
}

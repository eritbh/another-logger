import { makeArray } from './util.mjs';

/** Creates a logger from the given configuration. */
function createLogger(config) {
    // Create the object we'll fill with logger functions
    let logger = {};
    // Create logger functions for all configured levels and add them
    // NOTE: (keyof T)[] is safe to assert here since T is a type argument that
    //       exactly describes config. See also
    //       https://stackoverflow.com/a/55012175/1070107.
    for (const level of Object.keys(config)) {
        // Get the transport list as an array, filtering out falsy items
        const transports = makeArray(config[level]).filter(val => !!val);
        // Create the logger function for this level
        const loggerFunc = (...contents) => {
            // send message to all transports configured for this level
            transports.forEach(transport => transport(contents, level, logger));
        };
        logger[level] = loggerFunc;
    }
    return logger;
}

export { createLogger };
//# sourceMappingURL=Logger.mjs.map

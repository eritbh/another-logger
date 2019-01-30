// Defines the logger object.
interface Logger {
    debug: LoggingFunction;
    info: LoggingFunction;
    log: LoggingFunction;
    success: LoggingFunction;
    warn: LoggingFunction;
    error: LoggingFunction;
    [level: string]: LoggingFunction;
}

// Defines a function that logs things.
interface LoggingFunction {
    // log.info()
    (...contents: any[]): void;
    // log.info.trace()
    trace (...contents: any[]): void;
    // log.info.table()
    table (...contents: any[]): void;
}

// Defines config parameters for new loggers.
interface Config {
    timestamps?: boolean;
    label?: string;
    ignoredLevels?: string[];
    levels?: Levels;
}

// Defines log levels for new loggers.
interface Levels {
    [level: string]: {
        text?: string;
        style?: string | ((string) => string);
    };
}

// We export a function that returns a Logger, but which also acts as a Logger
// itself. If you don't need to pass additional config as arguments, you can
// just require the module and start using it without creating another instance.
interface LoggerConstructor extends Logger {
    (config?: Config, levels?: Levels): Logger;
}

declare const logger: LoggerConstructor;
export = logger;

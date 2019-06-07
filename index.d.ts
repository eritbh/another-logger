// Defines the logger object.
interface Logger {
    [level: string]: LoggingFunction;
}

// Defines a function that logs things.
interface LoggingFunction {
    /** Send a message through the logger. */
    (...contents: any[]): void;
    /** Send a message and include a stack trace. */
    trace (...contents: any[]): void;
    /**
     * Render a table with the given input, optionally filtering the rendered
     * properties.
     */
    table (tabularData: any, properties?: string[]): void;
}

// Defines config parameters for new loggers.
interface Config {
    /** Whether or not messages should display timestamps */
    timestamps?: boolean;
    /** A string to display with all messages this logger sends */
    label?: string;
    /** An array or object of ignored level names */
    ignoredLevels?: string[] | {
        [x: string]: boolean;
    };
    /** An object of custom levels to add to the logger */
    levels?: Levels;
    /** A stream that receives all output from this logger */
    stream?: CustomStream;
}

/** An object that can serve as a custom output stream. */
interface CustomStream {
    write (data: string): any;
}

/** An object defining additional log levels. */
interface Levels {
    /** The name of the level */
    [level: string]: {
        /** The text displayed when the level is used */
        text?: string;
        /** A string or function used to style the level's text */
        style?: string | ((string) => string);
        /** A stream that receives all output from this level */
        stream: CustomStream;
    };
}

// We export a function that returns a Logger, but which also acts as a Logger
// itself. If you don't need to pass additional config as arguments, you can
// just require the module and start using it without creating another instance.
interface LoggerConstructor extends Logger {
    (config?: Config): Logger;
}

/** The default logger object. */
declare const logger: LoggerConstructor;
export = logger;

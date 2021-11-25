export * from './Logger';
export * from './transports/browserConsoleTransport';
/**
 * A transport that sends messages to the browser console, with level colors set
 * for six levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
export declare const browserConsole: import("./Logger").Transport<string | number | symbol>;
/**
 * An appropriate console transport for the current platform. When running in
 * Node, it will be nodeConsole; when running in a browser, it will be
 * browserConsole. In either case, level styles/colors will be set for six
 * levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
export declare const platformConsole: import("./Logger").Transport<string | number | symbol>;
/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") and a single transport that logs messages to the
 * console.
 */
export declare const defaultLogger: import("./Logger").Logger<"debug" | "info" | "success" | "warn" | "error" | "fatal">;

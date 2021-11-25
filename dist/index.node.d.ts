export * from './index.browser';
export * from './transports/nodeConsole';
/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") that all log to the console with different colors.
 */
export declare const defaultLogger: import("./Logger").Logger<"debug" | "info" | "success" | "warn" | "error" | "fatal">;

export * from './index.browser';

import { createLogger } from './Logger';
import { createNodeConsoleTransport } from './transports/nodeConsoleTransport';
export { createNodeConsoleTransport };

/**
 * A transport that sends messages to the Node.js console, with level styles set
 * for six levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
export const nodeConsole = createNodeConsoleTransport({
	levelStyles: {
		debug: 'cyan',
		info: 'blue',
		success: 'green',
		warn: 'yellow',
		error: 'red',
		fatal: 'magenta',
	},
})

/**
 * An appropriate console transport for the current platform. When running in
 * Node, it will be nodeConsole; when running in a browser, it will be
 * browserConsole. In either case, level styles/colors will be set for six
 * levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
export const platformConsole = nodeConsole;

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") and a single transport that logs messages to the
 * console.
 */
export const defaultLogger = createLogger({
	debug: platformConsole,
	info: platformConsole,
	success: platformConsole,
	warn: platformConsole,
	error: platformConsole,
	fatal: platformConsole,
});

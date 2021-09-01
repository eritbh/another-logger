import { isNode } from './util';
import { BrowserConsoleTransport } from './transports/BrowserConsoleTransport';
import { NodeConsoleTransport } from './transports/NodeConsoleTransport';
import { createLogger } from './Logger';

/**
 * An appropriate console transport for the current platform. When running in 
 * Node, it will be a NodeConsoleTransport; when running in a browser, it will
 * be a BrowserConsoleTransport. In either case, level styles/colors will be set
 * for six levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
export const consoleTransport = isNode ? new NodeConsoleTransport({
	levelStyles: {
		debug: 'cyan',
		info: 'blue',
		success: 'green',
		warn: 'yellow',
		error: 'red',
		fatal: 'magenta',
	},
}) : new BrowserConsoleTransport({
	levelColors: {
		debug: 0x11A8CD,
		info: 0x2472C8,
		success: 0x0DBC79,
		warn: 0xE5E510,
		error: 0xCD3131,
		fatal: 0xBC3FBC,
	},
});

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") and a single transport that logs messages to the
 * console.
 */
export const defaultLogger = createLogger({
	debug: consoleTransport,
	info: consoleTransport,
	success: consoleTransport,
	warn: consoleTransport,
	error: consoleTransport,
	fatal: consoleTransport,
});

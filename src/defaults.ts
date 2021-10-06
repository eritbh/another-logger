import { isNode } from './util';
import { createBrowserConsoleTransport } from './transports/BrowserConsoleTransport';
import { createNodeConsoleTransport } from './transports/NodeConsoleTransport';
import { createLogger } from './Logger';

/**
 * A transport that sends messages to the browser console, with level colors set
 * for six levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
export const browserConsole = createBrowserConsoleTransport({
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
export const platformConsole = isNode ? nodeConsole : browserConsole;

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

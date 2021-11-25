export * from './index.browser';
export * from './transports/nodeConsole';

import { createLogger } from './Logger';
import { nodeConsole } from './transports/nodeConsole';

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") that all log to the console with different colors.
 */
export const defaultLogger = createLogger({
	debug: nodeConsole('cyan'),
	info: nodeConsole('blue'),
	success: nodeConsole('green'),
	warn: nodeConsole('yellow'),
	error: nodeConsole('red'),
	fatal: nodeConsole('magenta'),
});

export * from './Logger';
export * from './transports/browserConsole';

import { createLogger } from './Logger';
import { browserConsole } from './transports/browserConsole';

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") that all log to the console with different colors.
 */
export const defaultLogger = createLogger({
	debug: browserConsole(0x11A8CD),
	info: browserConsole(0x2472C8),
	success: browserConsole(0x0DBC79),
	warn: browserConsole(0xE5E510),
	error: browserConsole(0xCD3131),
	fatal: browserConsole(0xBC3FBC),
});

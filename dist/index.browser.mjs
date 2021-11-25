import { createLogger } from './Logger.mjs';
export { createLogger } from './Logger.mjs';
import { browserConsole } from './transports/browserConsole.mjs';
export { browserConsole } from './transports/browserConsole.mjs';

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") that all log to the console with different colors.
 */
const defaultLogger = createLogger({
    debug: browserConsole(0x11A8CD),
    info: browserConsole(0x2472C8),
    success: browserConsole(0x0DBC79),
    warn: browserConsole(0xE5E510),
    error: browserConsole(0xCD3131),
    fatal: browserConsole(0xBC3FBC),
});

export { defaultLogger };
//# sourceMappingURL=index.browser.mjs.map

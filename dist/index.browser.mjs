import { createLogger } from './Logger.mjs';
export { createLogger } from './Logger.mjs';
import { createBrowserConsoleTransport } from './transports/browserConsoleTransport.mjs';
export { createBrowserConsoleTransport } from './transports/browserConsoleTransport.mjs';

/**
 * A transport that sends messages to the browser console, with level colors set
 * for six levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
const browserConsole = createBrowserConsoleTransport({
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
 * An appropriate console transport for the current platform. When running in
 * Node, it will be nodeConsole; when running in a browser, it will be
 * browserConsole. In either case, level styles/colors will be set for six
 * levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
const platformConsole = browserConsole;
/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") and a single transport that logs messages to the
 * console.
 */
const defaultLogger = createLogger({
    debug: platformConsole,
    info: platformConsole,
    success: platformConsole,
    warn: platformConsole,
    error: platformConsole,
    fatal: platformConsole,
});

export { browserConsole, defaultLogger, platformConsole };
//# sourceMappingURL=index.browser.mjs.map

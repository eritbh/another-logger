'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Logger = require('./Logger.cjs');
var browserConsole = require('./transports/browserConsole.cjs');

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") that all log to the console with different colors.
 */
const defaultLogger = Logger.createLogger({
    debug: browserConsole.browserConsole(0x11A8CD),
    info: browserConsole.browserConsole(0x2472C8),
    success: browserConsole.browserConsole(0x0DBC79),
    warn: browserConsole.browserConsole(0xE5E510),
    error: browserConsole.browserConsole(0xCD3131),
    fatal: browserConsole.browserConsole(0xBC3FBC),
});

exports.createLogger = Logger.createLogger;
exports.browserConsole = browserConsole.browserConsole;
exports.defaultLogger = defaultLogger;
//# sourceMappingURL=index.browser.cjs.map

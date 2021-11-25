'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./index.browser.cjs');
var nodeConsole = require('./transports/nodeConsole.cjs');
var Logger = require('./Logger.cjs');
var browserConsole = require('./transports/browserConsole.cjs');

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") that all log to the console with different colors.
 */
const defaultLogger = Logger.createLogger({
    debug: nodeConsole.nodeConsole('cyan'),
    info: nodeConsole.nodeConsole('blue'),
    success: nodeConsole.nodeConsole('green'),
    warn: nodeConsole.nodeConsole('yellow'),
    error: nodeConsole.nodeConsole('red'),
    fatal: nodeConsole.nodeConsole('magenta'),
});

exports.nodeConsole = nodeConsole.nodeConsole;
exports.createLogger = Logger.createLogger;
exports.browserConsole = browserConsole.browserConsole;
exports.defaultLogger = defaultLogger;
//# sourceMappingURL=index.node.cjs.map

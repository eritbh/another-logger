'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index_browser = require('./index.browser.cjs');
var Logger = require('./Logger.cjs');
var nodeConsoleTransport = require('./transports/nodeConsoleTransport.cjs');
var browserConsoleTransport = require('./transports/browserConsoleTransport.cjs');

/**
 * A transport that sends messages to the Node.js console, with level styles set
 * for six levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
const nodeConsole = nodeConsoleTransport.createNodeConsoleTransport({
    levelStyles: {
        debug: 'cyan',
        info: 'blue',
        success: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'magenta',
    },
});
/**
 * An appropriate console transport for the current platform. When running in
 * Node, it will be nodeConsole; when running in a browser, it will be
 * browserConsole. In either case, level styles/colors will be set for six
 * levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
const platformConsole = nodeConsole;
/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") and a single transport that logs messages to the
 * console.
 */
const defaultLogger = Logger.createLogger({
    debug: platformConsole,
    info: platformConsole,
    success: platformConsole,
    warn: platformConsole,
    error: platformConsole,
    fatal: platformConsole,
});

exports.browserConsole = index_browser.browserConsole;
exports.createLogger = Logger.createLogger;
exports.createBrowserConsoleTransport = browserConsoleTransport.createBrowserConsoleTransport;
exports.defaultLogger = defaultLogger;
exports.nodeConsole = nodeConsole;
exports.platformConsole = platformConsole;
//# sourceMappingURL=index.node.cjs.map

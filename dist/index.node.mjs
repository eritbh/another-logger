export { browserConsole } from './index.browser.mjs';
import { createLogger } from './Logger.mjs';
export { createLogger } from './Logger.mjs';
import { createNodeConsoleTransport } from './transports/nodeConsoleTransport.mjs';
export { createBrowserConsoleTransport } from './transports/browserConsoleTransport.mjs';

/**
 * A transport that sends messages to the Node.js console, with level styles set
 * for six levels: "debug", "info", "success", "warn", "error", and "fatal".
 */
const nodeConsole = createNodeConsoleTransport({
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
const defaultLogger = createLogger({
    debug: platformConsole,
    info: platformConsole,
    success: platformConsole,
    warn: platformConsole,
    error: platformConsole,
    fatal: platformConsole,
});

export { defaultLogger, nodeConsole, platformConsole };
//# sourceMappingURL=index.node.mjs.map

import './index.browser.mjs';
import { nodeConsole } from './transports/nodeConsole.mjs';
export { nodeConsole } from './transports/nodeConsole.mjs';
import { createLogger } from './Logger.mjs';
export { createLogger } from './Logger.mjs';
export { browserConsole } from './transports/browserConsole.mjs';

/**
 * A default logger with six levels ("debug", "info", "success", "warn",
 * "error", and "fatal") that all log to the console with different colors.
 */
const defaultLogger = createLogger({
    debug: nodeConsole('cyan'),
    info: nodeConsole('blue'),
    success: nodeConsole('green'),
    warn: nodeConsole('yellow'),
    error: nodeConsole('red'),
    fatal: nodeConsole('magenta'),
});

export { defaultLogger };
//# sourceMappingURL=index.node.mjs.map

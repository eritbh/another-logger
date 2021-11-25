import { formatWithOptions } from 'util';
import ansiColors from 'ansi-colors';

/** A transport that logs messages to the Node.js console. */
const nodeConsole = (style = [], label = null, formatOptions = {}) => {
    // Use colored output unless explicitly disabled
    formatOptions = Object.assign({ colors: true }, formatOptions);
    if (!Array.isArray(style))
        style = [style];
    return function nodeConsoleTransport(contents, levelName) {
        let message = formatWithOptions(formatOptions, ...contents);
        let levelText = label ?? String(levelName);
        style.forEach(s => levelText = ansiColors[s](levelText));
        console.log(`${levelText} ${message}`);
    };
};

export { nodeConsole };
//# sourceMappingURL=nodeConsole.mjs.map

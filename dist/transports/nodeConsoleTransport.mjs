import { formatWithOptions } from 'util';
import ansiColors from 'ansi-colors';

/** A transport that logs messages to the Node.js console. */
const createNodeConsoleTransport = ({ formatOptions = {}, showTimestamps = false, levelStyles = {}, } = {}) => {
    // Use colored output unless explicitly disabled
    formatOptions = Object.assign({ colors: true }, formatOptions);
    // Cache the text/styles used for each level
    const levelTextCache = new Map();
    for (let [levelName, styles] of Object.entries(levelStyles)) {
        let levelText = levelName;
        if (!Array.isArray(styles))
            styles = [styles];
        styles.forEach(style => levelText = ansiColors[style](levelText));
        levelTextCache.set(levelName, levelText);
    }
    return function nodeConsoleTransport(contents, levelName) {
        let message = formatWithOptions(formatOptions, ...contents);
        const levelText = levelTextCache.get(levelName) || String(levelName);
        console.log(`${showTimestamps ? new Date().toISOString().substr(11, 8) + ' ' : ''}${levelText} ${message}`);
    };
};

export { createNodeConsoleTransport };
//# sourceMappingURL=nodeConsoleTransport.mjs.map

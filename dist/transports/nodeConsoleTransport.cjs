'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var util = require('util');
var ansiColors = require('ansi-colors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ansiColors__default = /*#__PURE__*/_interopDefaultLegacy(ansiColors);

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
        styles.forEach(style => levelText = ansiColors__default['default'][style](levelText));
        levelTextCache.set(levelName, levelText);
    }
    return function nodeConsoleTransport(contents, levelName) {
        let message = util.formatWithOptions(formatOptions, ...contents);
        const levelText = levelTextCache.get(levelName) || String(levelName);
        console.log(`${showTimestamps ? new Date().toISOString().substr(11, 8) + ' ' : ''}${levelText} ${message}`);
    };
};

exports.createNodeConsoleTransport = createNodeConsoleTransport;
//# sourceMappingURL=nodeConsoleTransport.cjs.map

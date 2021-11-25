'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var util = require('util');
var ansiColors = require('ansi-colors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ansiColors__default = /*#__PURE__*/_interopDefaultLegacy(ansiColors);

/** A transport that logs messages to the Node.js console. */
const nodeConsole = (style = [], label = null, formatOptions = {}) => {
    // Use colored output unless explicitly disabled
    formatOptions = Object.assign({ colors: true }, formatOptions);
    if (!Array.isArray(style))
        style = [style];
    return function nodeConsoleTransport(contents, levelName) {
        let message = util.formatWithOptions(formatOptions, ...contents);
        let levelText = label ?? String(levelName);
        style.forEach(s => levelText = ansiColors__default['default'][s](levelText));
        console.log(`${levelText} ${message}`);
    };
};

exports.nodeConsole = nodeConsole;
//# sourceMappingURL=nodeConsole.cjs.map

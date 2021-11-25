'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/** Whether we're running under Node.js. If not, we're running in a browser. */
globalThis.process?.versions?.node != null;
/** If the input value is not an array, converts it to an array. */
function makeArray(val) {
    if (!Array.isArray(val)) {
        return [val];
    }
    return val;
}

exports.makeArray = makeArray;
//# sourceMappingURL=util.cjs.map

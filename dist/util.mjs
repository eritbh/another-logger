/** Whether we're running under Node.js. If not, we're running in a browser. */
globalThis.process?.versions?.node != null;
/** If the input value is not an array, converts it to an array. */
function makeArray(val) {
    if (!Array.isArray(val)) {
        return [val];
    }
    return val;
}

export { makeArray };
//# sourceMappingURL=util.mjs.map

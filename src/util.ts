/** Whether we're running under Node.js. If not, we're running in a browser. */
// Since we polyfill Node stuff via Rollup, we can be sure `process.versions`
// exists even in the browser, so we can check for a Node version directly.
export const isNode = process.versions.node != null;

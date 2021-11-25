# another-logger [![npm](https://img.shields.io/npm/v/another-logger.svg)](https://www.npmjs.com/package/another-logger) [![npm@next](https://img.shields.io/npm/v/another-logger/next.svg)](https://www.npmjs.com/package/another-logger/v/next)

A lightweight logging utility for Node.js and the browser.

<p align="center">
<img alt="Example screenshot 1" src=".github/screenshots/windows-terminal.png" width="252">
<img alt="Example screenshot 2" src=".github/screenshots/firefox-devtools.png" width="252">
</p>

## Installation

```bash
npm install --omit dev another-logger
```

Use `--omit dev` to avoid installing this project's development dependencies.

If installing for use in browser environments only, you can also add the `--omit optional` flag, which will skip installing `ansi-colors` (used to enable color support for Node environments).

## Usage

```js
import {defaultLogger as log} from 'another-logger';
log.info('Hi there!');
```

See [USAGE.md](/USAGE.md) for a full walkthrough of the library, including logger customization and custom transports. Also see [the examples folder](/example) for complete configuration examples.

**TODO:** include docs link here as well

### Browser environments and build tools

This library is built for both CommonJS and ES6 module consumers, and for both Node.js and the browser. The module uses the `main`, `module`, and `browser` fields in its `package.json` to provide different entry points for these environments. The Node.js runtime and most build tools will use the most appropriate entry point automatically, but you may need to configure certain tools to pick up the correct version (for example, with Rollup, via the [`browser` option to `@rollup/plugin-node-resolve`](https://github.com/rollup/plugins/tree/master/packages/node-resolve#browser)).

If your setup doesn't support the `browser`/`module` fields (for example, [Typescript](https://github.com/microsoft/TypeScript/issues/7753)), you can manually specify your entry point as `another-logger/dist/index.{browser,node}.{mjs,cjs}`. For example:

```js
import {...} from 'another-logger/dist/index.browser.mjs';
```

## License

MIT &copy; eritbh

# another-logger [![npm](https://img.shields.io/npm/v/another-logger.svg)](https://www.npmjs.com/package/another-logger)

Yet another Node console.log alternative. Inspired by the looks of [Yarn](https://yarnpkg.com/).

## Installation

```bash
# yarn
yarn add another-logger
# npm
npm install another-logger
```

## Usage

```js
const log = require('another-logger')

log.debug('test 123 foobar')
log.info('huh, neat')
log.success('woo we did it')
log.warn('that doesnt sound good')
log.error('shitshitshit')
```

![Example screenshot 1](screenshots/example-1.png)

```js
const Logger = require('another-logger')
const log = new Logger('myapp', {
	timestamp: true,
	levels: {
		custom: {text: 'look at me', style: 'underline.bold.magenta'}
	},
	ignoredLevels: ['debug']
})

log.debug('test 123 foobar')
log.info('huh, neat')
log.success('woo we did it')
log.warn('that doesnt sound good')
log.error('shitshitshit')
log.custom('woah dude')
```

![Example screenshot 2](screenshots/example-2.png)

## Documentation

### `const log = require('another-logger')(config)`
### `const log = require('another-logger')`

Create a new logger instance.

`config` is an object with the following properties:

- `timestamps` - True or false. If true, a timestamp is included in front of all output.

- `levels` - An object of additional levels to add to the logger. Each key of the object is the name of a logger, and the value should be another object with the following keys:

	- `text` - Custom text to display for this level. If omitted, the name of the level is used (which is sufficient most of the time).

	- `style` - The style to use for displaying this level's name. This can be a function or a string; if it's a string, it will be parsed as a space and/or period-separated list of chalk's named styles (red, gray, bgBlue, etc).

	- `stream` - The stream this log should output to. Overrides the logger setting on a per-level basis.

	Note that the `levels` object can optionally be passed as a second argument to the function rather than as a key of the main config object. This can be useful if you import config options but want to override the levels per-file, for example.

- `ignoredLevels` - An array of level names to ignore. These levels will not error, but won't write anything to the console when they're called, either. Useful for debug levels that shouldn't show anything in production.

- `label` - A label to print along with all output. Note that this can also be specified as a first argument in the constructor; if both are specified, the positional argument takes precedence over the object property.

You can also use the exported function as an object directly, and it will behave according to the default configuration. (This is somewhat complicated and needs to be better documented, but oh well. See the examples above for more information.)

Note that this config object can also be specified in a `logger.config.js(on)` file in the current working directory. If this file exists, all other config will be applied on top of it.

```js
const myLogger = require('another-logger')({
  label: 'global',
  timestamps: true,
  levels: {
    messedItUp: {text: 'problem:', style: 'magenta'}
  }
});
```

### `log.<name>(content...)` or `log._log(name, content...)`

Execute a log. `name` can be any level name - one of the defaults of `debug`, `info`, `success`, `warn`, or `error`, or a custom one provided in the logger's config. Content arguments are processed via `require('util').format()` which means it works in the same way as `console.log` in regards to format strings, object previewing, etc.

```js
myLogger.messedItUp('some error info');
//=> 15:47:13 global problem: some error info
```

### `log.<name>.trace(content...)` or `log._trace(name, content...)`

The same as the normal log, but appends a stack trace to the log output. Essentially the same as `console.trace()`.

```js
myLogger.debug.trace('this is where the code happened');
//=> 15:47:13 global debug this is where the code happened
//=>     at Object.<anonymous> (example.js:11:12)
//=>     at ...
```

## License

MIT &copy; 2018 Geo1088

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

### `Logger.defaultLevels`

The default log levels loaded in without any configuration. These will remain if you pass custom levels in to the constructor, unless you override them.

### `Logger.styleFrom([style])`

Takes a style as input. If the style is anything but a string, returns the input. If it *is* a string, returns the chalk style function of the same name. A string can include multiple style names by separating them with dots or spaces; that is, `styleFrom('green.bgBlue') === require('chalk').green.bgBlue`.

### `const log = new Logger([[label, ]config])`

Create a new logger instance.

`config` is an object with the following properties:

- `stream` - The default stream to write output to. Defaults to `process.stdout` just like `console.log()` does.
- `timestamps` - True or false. If true, a timestamp is included in front of all output.
- `levels` - An object of additional levels to add to the logger. Each key of the object is the name of a logger, and the value should be another object with the following keys:
	- `text` - Custom text to display for this level. If omitted, the name of the level is used (which is sufficient most of the time).
	- `style` - The style to use for displaying this level's name. This can be a function or a string; if it's a string, it will be parsed as a space and/or period-separated list of chalk's named styles (red, gray, bgBlue, etc).
	- `stream` - The stream this log should output to. Overrides the logger setting on a per-level basis.
- `ignoredLevels` - An array of level names to ignore. These levels will not error, but won't write anything to the console when they're called, either. Useful for debug levels that shouldn't show anything in production.
- `label` - A label to print along with all output. Note that this can also be specified as a first argument in the constructor; if both are specified, the positional argument takes precedence over the object property.
- `labelStyle` - A style (a terminal style name as supported by chalk, or an arbitrary function) to apply to the label in the output.

Note that this config object can also be specified in a `logger.config.js(on)` file in the current working directory. If this file exists, all other config will be applied on top of it.

```js
const myLogger = new Logger('global', {
  timestamp: true,
  levels: {
    messedItUp: {level: 2, text: 'problem:', style: 'magenta'}
  }
})
```

### `log.<name>(content...)` or `log._log(name, content...)`

Execute a log. `name` can be any level name - one of the defaults of `debug`, `info`, `success`, `warn`, or `error`, or a custom one provided in the constructor. Content arguments are processed via `require('util').format()` which means it works in the same way as `console.log` in regards to format strings, object previewing, etc.

```js
myLogger.messedItUp('some error info')
//=> 15:47:13 global problem: some error info
```

### `log.<name>.trace(content...)` or `log._trace(name, content...)`

The same as the normal log, but appends a stack trace to the log output. Essentially the same as `console.trace()`.

```js
myLogger.debug.trace('this is where the code happened')
//=> 15:47:13 global debug this is where the code happened
//=>     at repl:1:10
//=>     at Script.runInThisContext (vm.js:96:20)
//=>     at REPLServer.defaultEval (repl.js:329:29)
//=>     ...
```

Better documentation coming soon hopefully.

## License

MIT

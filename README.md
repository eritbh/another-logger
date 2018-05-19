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
const Logger = require('another-logger')
const log = new Logger()

log.debug('test 123 foobar')
log.info('huh, neat')
log.success('woo we did it')
log.warn('that doesnt sound good')
log.error('shitshitshit')
```

![Example screenshot 1](screenshots/example-1.png)

```js
const Logger = require('./')
const log = new Logger({
	timestamp: true,
	minLevel: 0,
	levels: {
		custom: {level: 2, text: 'look at me', style: require('chalk').underline.bold.magenta}
	}
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

### `const log = new Logger({timestamp, minLevel, levels})`

Create a new logger instance.

- `timestamp` - True or false. If true, a timestamp is included in front of all output.
- `minLevel` - The minimum numeric level to output. Any output from a level less than this will be omitted. Defaults to `1`, which includes everything except `debug` in the default levels.
- `levels` - An object of additional levels to add to the logger. For example:

	```js
	new Logger({
		levels: {
			levelName: {
				level: 2,
				text: 'custom text',
				style: require('chalk').magenta
			}
		}
	})
	```

	In this example, the key `levelName` represents the name the level can be called by (e.g. in this case, `log.levelName()`). The properties are as follows: `level` is the numeric level number (for use with `minLevel` constructor option), `text` is the optional text to display in the console (defaults to the level's name), and `style` is an optional function that the text is run through before being rendered on the console.

### `log.<level name>(content...)`

Execute a log. `<level name>` can be any level name - one of the defaults of `debug`, `info`, `success`, `warn`, or `error`, or a custom one provided in the constructor. Multiple arguments can be passed in for content, and if non-strings are passed, they will be inspected via `require('util').inspect` before being printed.

Better documentation coming soon hopefully.

## License

MIT

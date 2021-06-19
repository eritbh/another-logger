# Usage

First-time user? Trying to get a feel for the library? This guide will walk you through everything from the most basic drop-in usage to advanced configuration and writing custom transports.

## Minimal Setup

For a small project, using the logger is as easy as importing `defaultLogger` and calling the built-in levels:

```js
import {defaultLogger as log} from 'another-logger';

log.info('Hello, world!');
```

There are six levels provided by default: `debug`, `info`, `success`, `farn`, `error`, and `fatal`. By default, calling a log level prints the message to the console, appending the level name in a unique color for visibility.

## Creating new loggers

The default logger instance works great as a drop-in replacement for `console.log` in smaller projects, but as your project grows, you'll probably want to modify the behavior of your logger a bit. Perhaps you want to disable some levels in production environments or add a custom level. We'll cover how to do all this in the next section, but first we'll have to create a new logger instance and share it with the rest of the project.

Configuration options can't be set when using the default logger, but don't worry! You can create a new file dedicated to your new, shiny custom logger, then import it in place of the default logger in the rest of your project.

```js
// myLogger.js
import {createLogger} from 'another-logger';

export default createLogger({
	// your config will go here!
})
```

```js
// index.js
import log from './myLogger';

log.info('Custom logger, engage!');
```

## Basic configuration

Logger options are split up into two major parts:

- `transports` defines all the different methods of displaying log messages. By default, `another-logger` registers a transport that puts log messages in the console, just like `console.log`. However, you can define additional transports that do almost anything with your messages - for example, sending messages in chat apps, or integrating with third-party error reporting services.
- `levels` controls the types of log messages you can use. We mentioned the six default levels before - `debug`, `info`, `success`, `warn`, `error`, and `fatal`. This key is also used to set which transports to send each type of message to.

Let's break down the configuration of the default logger we used before. It might look scary and big at first, but don't panic!

```js
export const defaultLogger = createLogger({
	levels: {
		debug: true,
		info: true,
		log: true,
		success: true,
		warn: true,
		error: true,
		fatal: true,
	},
	transports: {
		console: new NodeConsoleTransport({
			levelStyles: {
				debug: 'cyan',
				info: 'blue',
				success: 'green',
				warn: 'yellow',
				error: 'red',
				fatal: 'magenta',
			}
		})
	}
});
```

The `levels` object in the default config is pretty simple; it just lists the name of all the levels we want to be able to use. Setting each level to `true` means that it gets sent to all transports, but we'll show how you can change this in the next example.

The `transports` section is more interesting, containing a `NodeConsoleTransport` called `console`. As you might expect, `NodeConsoleTransport` is a transport built into the library that sends log messages to the console for Node.js projects - this is the bit that's responsible for making sure your log messages get sent somewhere! This particular type of transport takes a `levelStyles` option that lets us customize the color of each of our levels, but keep in mind that different transports can take different options depending on what they do.

Note that the levels defined in the `levels` section are nothing more than names. Levels do not have any inherent presentation or semantics; those concerns are the responsibility of transports.

---

Now let's take a look at a configuration with a more exciting `levels` section:

# TODO: finish out this section once I revise the way level->transport configuration works

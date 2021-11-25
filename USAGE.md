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

The default logger instance works great as a drop-in replacement for `console.log` in smaller projects, but as your project grows, you'll probably want to modify the behavior of your logger a bit. Perhaps you want to disable some levels in production environments or add a custom level. We'll cover how to do all this in the next section, but first we'll have to create a new logger instance and share it with the rest of the project. When creating a new logger, you provide it with a list of log levels, and you specify which *transports* to use for each level. Transports define how log messages are reported or displayed; we'll talk more about them in a moment.

Let's start by setting up our own new logger that does the same thing as the default one, assuming we're working in a Node.js environment:

```js
// myLogger.js
import {createLogger, nodeConsole} from 'another-logger';

export default createLogger({
	debug: nodeConsole('cyan'),
	info: nodeConsole('blue'),
	success: nodeConsole('green'),
	warn: nodeConsole('yellow'),
	error: nodeConsole('red'),
	fatal: nodeConsole('magenta'),
});
```

The `createLogger` function takes a single object argument. The keys of the object are the names of your levels, and the value for each level is a transport or list of transports to use for the level. What's a transport, you ask? Let's look at them in more detail now.

## Transports

A *transport* is really just a function that handles the arguments you passed to the level. It takes the arguments and the level name and does something with them - displays them in the console, sends a message to your favorite chat app, reports data to a third-party service, whatever you want.

You can write your own transports very easily. Here's a very basic example:

```js
import {createLogger} from 'another-logger';

function myTransport (options) {
	return (args, level) => {
		console.log(`${level}:`, ...args);
	}
}

const log = createLogger({
	myLevel: myTransport(),
});

log.myLevel('Hello there!');
//> myLevel: Hello there!
```

The `nodeConsole` we used in the example above is a simple transport that logs to the console exactly like this - it takes some arguments that tell it how to color the message, then returns a function that processes messages by adding color and logging to the console. The built-in `browserConsole` transport, for use in frontend environments, works very similarly but takes colors as hex color codes rather than as color names:

```js
import {createLogger, browserConsole} from 'another-logger';

const log = createLogger({
	foo: browserConsole(0x0000FF),
	bar: browserConsole(0x00FF00),
});

log.foo('hello!'); // "foo" will be blue
log.bar('goodbye!'); // "bar" will be green
```

## Writing Custom Transports

The library comes with these basic console transports for Node and the browser, but you can do much more than that. For example, let's say you want to write a transport that sends your message to a chat app by sending an HTTP request. It might look something like this:

```js
import fetch from 'node-fetch';

export function createChatAppTransport(options) {
	return (args, level) => {
		// Arguments to the log function are provided as-is
		let message = args.join(' ');
		fetch('https://my.chat.app/send-message', {
			method: 'POST',
			body: message,
		});
	}
}
```

This is a very simplistic example, but it shows you the kind of stuff you can do with custom transports. It also highlights something important - transports receive the arguments you pass to the log function directly, without formatting. This means that if you do `log.info(42, {a: 1, b: 2})`, then your transport will get `args` of `[42, {a: 1, b: 2}]` - the exact object references are passed directly. You can pass arbitrary values into log functions, so you'll need to format or serialize the arguments nicely for wherever you're pushing the data. Also, **make sure your custom transports don't accidentally modify objects you pass in!** The last thing you want is a logging function accidentally rewriting properties of an object into something else and causing your program to behave differently.

## More stuff

there is more that this file should talk about probably

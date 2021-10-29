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

The default logger instance works great as a drop-in replacement for `console.log` in smaller projects, but as your project grows, you'll probably want to modify the behavior of your logger a bit. Perhaps you want to disable some levels in production environments or add a custom level. We'll cover how to do all this in the next section, but first we'll have to create a new logger instance and share it with the rest of the project. When creating a new logger, you provide it with a list of log levels, and you specify which *transports* to use for each level. Transports define how log messages are reported; we'll talk more about them in a moment.

Let's start by setting up our own new logger that does the same thing as the default one:

```js
// myLogger.js
import {createLogger, platformConsole} from 'another-logger';

export default createLogger({
	debug: [platformConsole],
	info: [platformConsole],
	success: [platformConsole],
	warn: [platformConsole],
	error: [platformConsole],
	fatal: [platformConsole],
})
```

The `createLogger` function takes a single object argument. The keys of the object are the names of your levels, and the value for each level is the list of transports to use for the level. This is a pretty boring logger, since we're still just using the default `platformConsole` transport; let's look at transports in more detail now.

## Transports

A *transport* is really just a function that handles the arguments you passed to the level. It takes the arguments and the level and does something with them - displays them in the console, sends a message to your favorite chat app, reports data to a third-party service, whatever you want.

You can write your own transports very easily. Here's a very basic example:

```js
import {createLogger} from 'another-logger';

function myTransport (args, level) {
	console.log(`${level}:`, ...args);
}

const log = createLogger({
	myLevel: [myTransport],
});

log.myLevel('Hello there!');
//> myLevel: Hello there!
```

The `platformTransport` we used in the example above is a simple transport that logs to the console. It works slightly differently depending on whether you're working in a browser environment or in Node.js, but either way, it takes each message and gives the message a color depending on its level. In a browser, you can customize those colors by using the `createBrowserConsoleTransport()` function, which will return a new transport function that color-codes your levels however you like.

```js
import {createLogger, createBrowserConsoleTransport} from 'another-logger';

const myConsoleTransport = createBrowserConsoleTransport({
	levelColors: {
		foo: 0x0000FF,
		bar: 0x00FF00,
	},
});

const log = createLogger({
	foo: [myConsoleTransport],
	bar: [myConsoleTransport],
});

log.foo('hello!'); // "foo" will be blue
log.bar('goodbye!'); // "bar" will be green
```

In Node.js, you can use `createNodeConsoleTransport` to create a custom transport that allows you to color-code levels via terminal styles in much the same way. See the [documentation](TODO) for more details.

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
		})
	}
}
```

This is a very simplistic example, but it shows you the kind of stuff you can do with custom transports. It also highlights something important - transports receive the arguments you pass to the log function directly, without formatting. This means that if you do `log.info(42, {a: 1, b: 2})`, then your transport will get `args` of `[42, {a: 1, b: 2}]` - the exact object references are passed directly. You need to format the arguments yourself, and **make sure your custom transports don't accidentally modify objects you pass in!**

## More stuff

there is more that this file should talk about probably

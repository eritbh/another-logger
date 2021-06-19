import { LoggerConfig } from './Logger';
import { BrowserConsoleTransport } from './transports/BrowserConsoleTransport';
import { NodeConsoleTransport } from './transports/NodeConsoleTransport';

// If true, we're running under Node.js. If false, we're in a browser.
const isNode = typeof process !== 'undefined' && process.version != null && process.versions.node != null;

/** Configuration options for the default logger. */
export const defaultConfig: LoggerConfig = {
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
		console: isNode ? new NodeConsoleTransport({
			levelStyles: {
				debug: 'cyan',
				info: 'blue',
				success: 'green',
				warn: 'yellow',
				error: 'red',
				fatal: 'magenta',
			}
		}) : new BrowserConsoleTransport({
			levelColors: {
				debug: 0x11A8CD,
				info: 0x2472C8,
				success: 0x0DBC79,
				warn: 0xE5E510,
				error: 0xCD3131,
				fatal: 0xBC3FBC,
			},
		}),
	}
}

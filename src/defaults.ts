import { isNode } from './util';
import { BrowserConsoleTransport } from './transports/BrowserConsoleTransport';
import { NodeConsoleTransport } from './transports/NodeConsoleTransport';

/** Configuration options for the default logger. */
// NOTE: We can't enforce that defaultConfig is a LoggerConfig without losing
//       more specific information that we want to keep about its structure, so
//       manually double-check that it's compatible with the LoggerConfig
//       interface after editing.
export const defaultConfig = {
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
	},
};

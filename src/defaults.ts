import { LoggerConfig } from './Logger';
import { NodeConsoleTransport } from './transports';

/**
 * The default configuration options. Options set in logger.config.js are
 * merged with these; that is, the default levels and the default `console`
 * transport will always be available, unless you override them by name.
 */
export const defaultConfig: LoggerConfig = {
	levels: {
		debug: true,
		info: true,
		log: true,
		success: true,
		warn: true,
		error: true,
	},
	transports: {
		console: new NodeConsoleTransport({
			levelStyles: {
				debug: 'cyan',
				info: 'blue',
				success: 'green',
				warn: 'yellow',
				error: 'red',
			}
		}),
	}
}

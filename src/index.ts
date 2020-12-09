import path from 'path';

import { Logger, createLogger, LoggerConfig } from './Logger';
import { defaultConfig } from './defaults';

// Attempt to read config from logger.config.js or logger.config.json in cwd
let baseConfig: any;
try {
	const configPath = path.join(process.cwd(), 'logger.config');
	// eslint-disable-next-line global-require
	const fileContents = require(configPath);
	baseConfig = fileContents || {};
} catch (_) {
	baseConfig = {};
}

// Create the default logger.
export const defaultLogger = createLogger(baseConfig);

/** Can be used as a logger. Can also be called to create a new logger. */
export default Object.assign(createLogger, defaultLogger) as Logger & typeof createLogger;

// Other public exports
export * from './transports';
export * from './Logger';
export * from './defaults';
export * from './fakeConsole';

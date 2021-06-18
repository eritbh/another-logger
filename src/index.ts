import path from 'path';

import { createLogger } from './Logger';

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

// Other public exports
export * from './models/Transport';
export * from './models/FormattedTransport';
export * from './transports/BrowserConsoleTransport';
export * from './transports/NodeConsoleTransport';
export * from './Logger';
export * from './defaults';
export * from './fakeConsole';

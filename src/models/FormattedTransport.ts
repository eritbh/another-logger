import { formatWithOptions, InspectOptions } from 'util';

import { Logger } from '../Logger';
import { Transport } from './Transport';

/**
 * A logging transport for Node.js that formats messages via `util.format` and
 * handles messages as strings. See also
 * {@link Transport}.
 */
export abstract class FormattedTransport extends Transport {
	/** Options passed to `util.formatWithOptions` when formatting messages. */
	formatOptions: InspectOptions;

	constructor (formatOptions: InspectOptions = {}) {
		super();
		this.formatOptions = formatOptions;
	}

	sendRaw (contents: any[], levelName: string, logger: Logger): void {
		let message = formatWithOptions(this.formatOptions, ...contents);
		this.send(message, levelName, logger);
	}

	/** Processes a log message given the message string. */
	abstract send (message: string, levelName: string, logger: Logger): void;
}

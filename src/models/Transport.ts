import { Logger } from '../Logger';

/**
 * A logging transport that handles raw message arguments. See also
 * {@link FormattedTransport}.
 */
export abstract class Transport {
	/** Processes a log message given the raw arguments passed to the logger. */
	abstract sendRaw(contents: any[], levelName: string, logger: Logger): void;
}

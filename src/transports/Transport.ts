import { Logger } from '../Logger';

export abstract class Transport {
	abstract send(message: string, levelName: string, logger: Logger): void;
}

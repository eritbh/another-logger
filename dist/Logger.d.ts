import { Falsy, MaybeArray } from './util';
/** A function which handles logger messages. */
export interface Transport<LevelName extends keyof any = keyof any> {
    (contents: any[], levelName: LevelName, logger: Logger): void;
}
/**
 * Configuration for a logger. Defines the level names and the transports they
 * connect to.
 */
export declare type LoggerConfig = {
    [name in keyof any]: MaybeArray<Falsy | Transport>;
};
/** A function that logs things at a particular level. */
export interface LoggerFunction {
    /** Sends a message to all transports configured for this level. */
    (...contents: any[]): void;
}
/** An object with methods for each configured log level. */
export declare type Logger<LevelName extends keyof any = keyof any> = {
    [key in LevelName]: LoggerFunction;
};
/** Creates a logger from the given configuration. */
export declare function createLogger<T extends LoggerConfig>(config: T): Logger<keyof T>;

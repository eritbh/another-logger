import { InspectOptions } from 'util';
import ansiColors from 'ansi-colors';
import { Transport } from '../Logger';
declare type StyleKey = keyof typeof ansiColors["styles"];
/** A transport that logs messages to the Node.js console. */
export declare const nodeConsole: (style?: StyleKey | StyleKey[], label?: string | null, formatOptions?: InspectOptions) => Transport;
export {};

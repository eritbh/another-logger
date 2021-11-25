/// <reference types="node" />
import { InspectOptions } from 'util';
import ansiColors from 'ansi-colors';
import { Transport } from '../Logger';
declare type StyleKey = keyof typeof ansiColors["styles"];
/** A transport that logs messages to the Node.js console. */
export declare const createNodeConsoleTransport: ({ formatOptions, showTimestamps, levelStyles, }?: {
    formatOptions?: InspectOptions | undefined;
    showTimestamps?: boolean | undefined;
    levelStyles?: {
        [levelName: string]: keyof ansiColors.StylesType<ansiColors.StyleType> | (keyof ansiColors.StylesType<ansiColors.StyleType>)[];
    } | undefined;
}) => Transport;
export {};

import { Transport } from "../Logger";
/** A transport that logs messages to the browser console with a colored tag. */
export declare const browserConsole: (color?: number, label?: string | undefined) => Transport;

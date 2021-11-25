import { Transport } from "../Logger";
/** A transport that logs messages to the browser console. */
export declare const createBrowserConsoleTransport: ({ levelColors, }: {
    levelColors?: Record<string | number | symbol, number> | undefined;
}) => Transport;

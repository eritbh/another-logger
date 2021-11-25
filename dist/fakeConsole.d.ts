export declare function captureConsole(func: (capturedConsole: Console) => void): string;
/**
 * Returns the output of console.table as a string isntead of writing it to
 * stdout.
 * @param   Arguments as passed to `console.table`
 */
export declare function consoleTable(tabularData?: any, properties?: string[]): string;

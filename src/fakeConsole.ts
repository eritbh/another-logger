// Eventually we'll use a fake console for more stuff, for now this file just
// has the table routine

let fakeConsole: Console;
let lastResult: string;

/**
 * Returns the output of console.table as a string isntead of writing it to
 * stdout.
 * @param   Arguments as passed to `console.table`
 */
export function consoleTable(...contents: any[]) {
	if (!fakeConsole) {
		// `Console.table` internally calls `Console.log` to display results, so
		// we override the log function to store the result in a variable
		// rather than sending it to stdout. Because we pass process.stdout to
		// the console constructor, the output string will contain color codes.
		// TODO: passing process.stdout as the stream doesn't actually give
		//       colored output
		// eslint-disable-next-line no-console
		fakeConsole = new console.Console(process.stdout);
		fakeConsole.log = (result: string) => {
			lastResult = result;
		};
	}
	// Calling the table function stores the result in `lastResult`...
	fakeConsole.table(...contents);
	// ...so we can just return that variable now!
	return lastResult;
}

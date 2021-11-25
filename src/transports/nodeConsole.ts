import { formatWithOptions, InspectOptions } from 'util';
import ansiColors from 'ansi-colors';

import { Transport } from '../Logger';

type StyleKey = keyof typeof ansiColors["styles"];

/** A transport that logs messages to the Node.js console. */
export const nodeConsole = (
	style: StyleKey | StyleKey[] = [],
	label: string | null = null,
	formatOptions: InspectOptions = {},
): Transport => {
	// Use colored output unless explicitly disabled
	formatOptions = Object.assign({colors: true}, formatOptions);

	if (!Array.isArray(style)) style = [style];

	return function nodeConsoleTransport (contents, levelName) {
		let message = formatWithOptions(formatOptions, ...contents);
		let levelText = label ?? String(levelName);
		(style as StyleKey[]).forEach(s => levelText = ansiColors[s](levelText));
		console.log(`${levelText} ${message}`);
	}
}

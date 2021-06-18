import ansiColors from 'ansi-colors';

import { FormattedTransport } from '../models/FormattedTransport';

type StyleKey = keyof typeof ansiColors["styles"];

/** A transport that logs messages to the Node.js console. */
export class NodeConsoleTransport extends FormattedTransport {
	showTimestamps: boolean;
	levelTextCache = new Map<string, string>();

	constructor({
		showTimestamps = false,
		levelStyles = {},
	}: {
		showTimestamps?: boolean,
		levelStyles?: { [levelName: string]: StyleKey | StyleKey[] },
	} = {}) {
		super({
			colors: true,
		});

		this.showTimestamps = showTimestamps;
		for (let [levelName, styles] of Object.entries(levelStyles)) {
			let levelText = levelName;
			if (!Array.isArray(styles)) styles = [styles];
			styles.forEach(style => levelText = ansiColors[style](levelText));
			this.levelTextCache.set(levelName, levelText);
		}
	}

	send(message: string, levelName: string) {
		const levelText = this.levelTextCache.get(levelName) || levelName;
		console.log(`${this.showTimestamps ? new Date().toISOString().substr(11, 8) + ' ' : ''}${levelText} ${message}`);
	}
}

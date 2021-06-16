const test = require('ava');
const ansiColors = require('ansi-colors')
const {captureStdout} = require('../testutil');

const {consoleTable} = require('..');

test('consoleTable', t => {
	const scenarios = [
		// Tabular data only
		[[[1, 2], [3, 4]]],
		[{a: 1, b: 'two', [Symbol('c')]: 'something', nested: {object: {action: 'foo'}}}],
		// Tabular data with properties list
		[{a: 1, b: 2, c: 3}, ['a', 'c']],
		[['a', 'b', 'c'], [0, 1]],
		// Non-tabular data
		['something that is not a table'],
		[48913],
		[null],
		[undefined],
		// No arguments
		[],
	];
	
	for (const args of scenarios) {
		// Get sample console.table output
		const consoleOutput = captureStdout(() => {
			console.table(...args);
		}).replace(/\n$/, '');
	
		// Get unit output
		const unitOutput = consoleTable(...args);

		// Compare
		t.is(ansiColors.stripColor(consoleOutput), unitOutput);
	}
})

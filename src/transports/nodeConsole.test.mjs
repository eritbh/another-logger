import test from 'ava';
import {spyOn} from 'nanospy';
import ansiColors from 'ansi-colors';

import {
	nodeConsole,
} from '../../dist/transports/nodeConsoleTransport.mjs';

test('Basic unstyled output of many types of values', t => {
	const consoleSpy = spyOn(console, 'log', () => undefined);
	let transport = nodeConsole([], null, {colors: false});

	transport([
		'some content',
		42,
		{a: 1, b: 2},
		[1, 2, 3],
	], 'test', {});

	t.assert(consoleSpy.called);
	let output = consoleSpy.calls[0][0];
	t.is(output, 'test some content 42 { a: 1, b: 2 } [ 1, 2, 3 ]');
});

test('Multiline strings and level colors', t => {
	const consoleSpy = spyOn(console, 'log', () => undefined);
	const transport = nodeConsole(['red']);

	transport(['or is it an error?\n\n\n   yarr'], 'foo', {});

	t.assert(consoleSpy.called);
	let output = consoleSpy.calls[0][0];
	t.is(output, `${ansiColors.red('foo')} or is it an error?\n\n\n   yarr`);
});

import test from 'ava';
import {spyOn} from 'nanospy';
import ansiColors from 'ansi-colors';

import {
	createNodeConsoleTransport,
} from '../../dist/transports/nodeConsoleTransport.mjs';

test('Basic unstyled output of many types of values', t => {
	const consoleSpy = spyOn(console, 'log', () => undefined);
	let transport = createNodeConsoleTransport({
		formatOptions: {colors: false},
	});

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
	const transport = createNodeConsoleTransport({
		levelStyles: {
			foo: 'red',
		}
	})

	transport(['or is it an error?\n\n\n   yarr'], 'foo', {});

	t.assert(consoleSpy.called);
	let output = consoleSpy.calls[0][0];
	t.is(output, `${ansiColors.red('foo')} or is it an error?\n\n\n   yarr`);
});

test('Timestamp logging', t => {
	const consoleSpy = spyOn(console, 'log', () => undefined);
	const transport = createNodeConsoleTransport({
		showTimestamps: true,
	});

	transport(['something creative'], 'foo', {});

	t.assert(consoleSpy.called);
	let output = consoleSpy.calls[0][0];
	t.regex(output, /^\d\d:\d\d:\d\d foo something creative$/);
});

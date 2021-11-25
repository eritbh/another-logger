import test from 'ava';
import {spyOn} from 'nanospy';

import {
	browserConsole,
} from '../../dist/transports/browserConsoleTransport.mjs';

test('Output values are passed through directly to console.log()', t => {
	const consoleSpy = spyOn(console, 'log', () => undefined);
	let transport = browserConsole();
	let obj = {a: 1, b: 2};
	let arr = [1, 2, 3];

	transport([
		'some content',
		42,
		obj,
		arr,
	], 'test', {});

	t.assert(consoleSpy.called);
	// We're not concerned with testing the specifics of the CSS style used to
	// make the console output pretty, we just want to make sure that our stuff
	// got passed through to the console
	t.is(consoleSpy.calls[0][4], 'some content');
	t.is(consoleSpy.calls[0][5], 42);
	t.is(consoleSpy.calls[0][6], obj);
	t.is(consoleSpy.calls[0][7], arr);
});

test('Level text and styling CSS', t => {
	const consoleSpy = spyOn(console, 'log', () => undefined);
	let transport = browserConsole(0x0094FF);

	transport(['hello'], 'foo', {});

	t.assert(consoleSpy.called);
	// again, we're not interested in testing the specifics of the CSS, just
	// that we see our level name and our custom color in there somewhere
	t.regex(consoleSpy.calls[0][0], /foo/);
	// The actual color used for the background is #0094FF7F, with the trailing
	// 7F added to set the color's alpha to 50%, but the original color is still
	// present in plain text before it
	t.regex(consoleSpy.calls[0][2], /#0094FF/i);
})

test('Label overrides level name', t => {
	const consoleSpy = spyOn(console, 'log', () => undefined);
	let transport = browserConsole(0, 'bar');

	transport(['hello'], 'foo', {});

	t.assert(consoleSpy.called);
	t.regex(consoleSpy.calls[0][0], /something custom/);
	t.notRegex(consoleSpy.calls[0][0], /foo/);
})

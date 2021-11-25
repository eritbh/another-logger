import test from 'ava';
import {spy} from 'nanospy';

import {createLogger} from '../dist/Logger.mjs';

test('Logger with no levels is an empty object', t => {
	let logger = createLogger({});

	t.deepEqual(logger, {});
});

test('Only properties of a logger are the names of its levels', t => {
	let logger = createLogger({
		foo: [],
		bar: [],
	});

	t.deepEqual(Object.keys(logger), ['foo', 'bar']);
});

test.skip('Logger cannot have Symbol levels', t => {
	t.throws(() => {
		createLogger({
			[Symbol()]: [],
		});
	});
});

test('Levels with no transports can be called', t => {
	let logger = createLogger({
		foo: [],
	});

	t.is(logger.foo(), undefined);
});

test('Transports are called with arguments', t => {
	let transport = spy();
	let logger = createLogger({
		foo: [transport],
	});

	logger.foo('hello', 42);

	t.true(transport.called);
	t.deepEqual(transport.calls[0], [['hello', 42], 'foo', logger]);
});

test('Transports are called with exact instances of passed objects', t => {
	let transport = spy();
	let logger = createLogger({
		foo: [transport],
	});

	let obj = {a: 1, b: 2};
	let arr = [1, 2, 3];
	logger.foo(obj, arr);

	t.is(transport.calls[0][0][0], obj);
	t.is(transport.calls[0][0][1], arr);
});

test('All transports on a level are called', t => {
	let a = spy();
	let b = spy();
	let logger = createLogger({
		foo: [a, b],
	});

	logger.foo();

	t.true(a.called);
	t.true(b.called);
});

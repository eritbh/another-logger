import test from 'ava';

import {makeArray} from '../dist/util.mjs';

test('makeArray', t => {
	t.deepEqual(makeArray('test'), ['test']);
	t.deepEqual(makeArray(42), [42]);
	t.deepEqual(makeArray(null), [null]);
	t.deepEqual(makeArray({a: 1, b: 2}), [{a: 1, b: 2}]);

	t.deepEqual(makeArray(['test']), ['test']);
	t.deepEqual(makeArray([42]), [42]);
	t.deepEqual(makeArray([null]), [null]);
	t.deepEqual(makeArray([{a: 1, b: 2}]), [{a: 1, b: 2}]);
})

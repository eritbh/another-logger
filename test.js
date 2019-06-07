'use strict';

const test = require('ava');

const chalk = require('chalk');
const logger = require('./');
const testLog = logger({ // test logger with a styleless level for easy checks
	levels: {
		test: {},
	},
});

test.before('Set up context variables for all tests', t => {
	t.context.oldStdoutWrite = process.stdout.write;
	t.context.stdout = '';
	t.context.stdoutWrites = 0;
});

test.beforeEach('Hijack process.stdout writing', t => {
	process.stdout.write = chunk => {
		t.context.stdout += chunk;
		t.context.stdoutWrites += 1;
	};
});

// all tests have to be serial because of how the stdout override works, rip

test.serial('table is identical to console.table for valid inputs', t => {
	const scenarios = [
		[[[1, 2], [3, 4]]],
		[{a: 1, b: 'two', [Symbol('c')]: 'something', nested: {object: {action: 'foo'}}}],
		['something that is not a table'],
		// TODO: literals other than strings are syntax highlighted in native
		//       output, but not ours - need to hijack
		//       [Symbol(kWriteToConsole)] instead of just .log()
		// [48913],
		// [null],
		// [undefined],
		// [], // no argument is equivalent to explicit undefined
	];
	for (const scenario of scenarios) {
		testLog.test.table(...scenario);
		const loggerOut = t.context.stdout.replace(/^test \n?/, '');
		t.context.stdout = '';
		console.table(...scenario);
		const consoleOut = t.context.stdout;
		t.context.stdout = '';
		t.assert(loggerOut === consoleOut);
	}
});

test.serial('basic functionality', t => {
	testLog.test('some content');
	t.assert(t.context.stdout === 'test some content\n');
});

test.serial('multilines and color things', t => {
	logger.error('or is it an error?\n\n\n   yarr');
	t.assert(t.context.stdout === `${chalk.red('error')} or is it an error?\n\n\n   yarr\n`);
});

test.serial('timestamps', t => {
	logger({timestamps: true}).info('something creative');
	t.assert(t.context.stdout.substring(0, 8).match(/\d\d:\d\d:\d\d/));
	t.assert(t.context.stdout.substring(8) === ` ${chalk.blue('info')} something creative\n`);
});

test.todo('trace stuff');
test.todo('fix literals being passed to .table');
test.todo('custom stream destinations');
test.todo('custom styles');
test.todo('ignored levels');
test.todo('a whole bunch of other things');

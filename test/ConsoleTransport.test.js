const test = require('ava');
const ansiColors = require('ansi-colors');
const {captureStdout} = require('../testutil');

const {createLogger, defaultLogger, ConsoleTransport} = require('..');

// test logger with a colorless level for easy checks
const testLog = createLogger({
	levels: {
		test: true,
	},
});

// all tests have to be serial because of how the stdout override works, rip

test.serial('basic functionality', t => {
	const output = captureStdout(() => testLog.test('some content'));
	t.is('test some content\n', output);
});

test.serial('multilines and color things', t => {
	const output = captureStdout(() => defaultLogger.error('or is it an error?\n\n\n   yarr'));
	t.is(`${ansiColors.red('error')} or is it an error?\n\n\n   yarr\n`, output);
});

test.serial('timestamps and level colors', t => {
	const logger = createLogger({
		transports: {
			console: new ConsoleTransport({
				levelStyles: {
					info: 'blue'
				},
				showTimestamps: true,
			}),
		},
	});
	const output = captureStdout(() => logger.info('something creative'));
	t.assert(output.substring(0, 8).match(/\d\d:\d\d:\d\d/));
	t.is(` ${ansiColors.blue('info')} something creative\n`, output.substring(8));
});

test.todo('trace stuff');
test.todo('fix literals being passed to .table');
test.todo('custom stream destinations');
test.todo('custom styles');
test.todo('ignored levels');
test.todo('a whole bunch of other things');

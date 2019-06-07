'use strict';

const log = require('./')({
	levels: {
		error: {
			style: 'red',
		},
	},
	stream: process.stderr,
});

log.info('stdout');
log.error('stderr');

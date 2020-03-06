/* tslint:disable:no-empty */

import { LoggerService } from '../';

test('logger', async () => {
    const logger = new LoggerService('test', 'test');

    await Promise.all([
        logger.alert('alert message', [1, 2, 3]),
        logger.critical('critical message', { test: 1 }),
        logger.debug('debug message', 'string'),
        logger.emergency('emergency message'),
        logger.error('error message'),
        logger.info('info message'),
        logger.notice('notice message'),
        logger.warning('warning message'),
    ]);
});

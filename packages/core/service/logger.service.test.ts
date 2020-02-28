/* tslint:disable:no-empty */

import LoggerService from './logger.service';
import ApplicationUtil from '../util/application.util';

test('logger', async () => {
    const logger = await ApplicationUtil.create<LoggerService>(LoggerService);

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

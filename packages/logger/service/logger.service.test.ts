import { LoggerService } from '../';

test('logger', async () => {
    const logger = new LoggerService('test', 'test');

    await Promise.all([
        logger.alert('alert message'),
        logger.critical('critical message'),
        logger.debug('debug message'),
        logger.emergency('emergency message'),
        logger.error('error message'),
        logger.info('info message'),
        logger.notice('notice message'),
        logger.warning('warning message'),
    ]);
});

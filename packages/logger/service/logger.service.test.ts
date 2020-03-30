import { LoggerService } from '../';
import { ContainerComponent, ServiceDecorator } from '@vokus/dependency-injection';

@ServiceDecorator()
class MyLoggerService extends LoggerService {}

test('logger', async () => {
    const logger: LoggerService = new LoggerService();

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

    const logger2: MyLoggerService = await ContainerComponent.create(MyLoggerService);

    logger2.alert('alert message');
});

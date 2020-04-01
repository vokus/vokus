import path from 'path';
import { LoggerService } from '../';
import { ContainerComponent, ServiceDecorator } from '@vokus/dependency-injection';
import { EnvironmentComponent } from '@vokus/environment';
import { FileSystemComponent } from '@vokus/file-system';

const pathToLogDir = path.join(EnvironmentComponent.projectPath, 'var', EnvironmentComponent.context, 'log');

beforeAll(async () => {
    await FileSystemComponent.remove(pathToLogDir);
});

afterAll(async () => {
    // await FileSystemComponent.remove(pathToLogDir);
});

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

    await Promise.all([
        logger2.alert('alert message'),
        logger2.critical('critical message'),
        logger2.debug('debug message'),
        logger2.emergency('emergency message'),
        logger2.error('error message'),
        logger2.info('info message'),
        logger2.notice('notice message'),
        logger2.warning('warning message'),
    ]);

    expect(await FileSystemComponent.readDirectory(pathToLogDir)).toEqual([
        'alert.log',
        'component',
        'critical.log',
        'debug.log',
        'emergency.log',
        'error.log',
        'info.log',
        'notice.log',
        'warning.log',
    ]);

    expect(await FileSystemComponent.readDirectory(path.join(pathToLogDir, 'component', 'container'))).toEqual([
        'alert.log',
        'critical.log',
        'debug.log',
        'emergency.log',
        'error.log',
        'info.log',
        'notice.log',
        'warning.log',
    ]);
});

import path from 'path';
import { LoggerService } from '../';
import { ContainerComponent } from '@vokus/dependency-injection';
import { EnvironmentComponent } from '@vokus/environment';
import { FileSystemComponent } from '@vokus/file-system';

const pathToLogDir = path.join(EnvironmentComponent.projectPath, 'var', EnvironmentComponent.context, 'log');

beforeAll(async () => {
    await FileSystemComponent.remove(pathToLogDir);
});

afterAll(async () => {
    await FileSystemComponent.remove(pathToLogDir);
});

test('logger', async () => {
    let loggerService: LoggerService = new LoggerService();

    await Promise.all([
        loggerService.alert('alert message'),
        loggerService.critical('critical message'),
        loggerService.debug('debug message'),
        loggerService.emergency('emergency message'),
        loggerService.error('error message'),
        loggerService.info('info message'),
        loggerService.notice('notice message'),
        loggerService.warning('warning message'),
    ]);

    loggerService = await ContainerComponent.create(LoggerService);

    await Promise.all([
        loggerService.alert('alert message'),
        loggerService.critical('critical message'),
        loggerService.debug('debug message'),
        loggerService.emergency('emergency message'),
        loggerService.error('error message'),
        loggerService.info('info message'),
        loggerService.notice('notice message'),
        loggerService.warning('warning message'),
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

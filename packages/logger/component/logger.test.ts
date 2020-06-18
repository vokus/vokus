import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { LoggerService } from '..';
import { ObjectManager } from '@vokus/dependency-injection';
import path from 'path';

const pathToLogDir = path.join(Environment.projectPath, 'var', Environment.context, 'log');

beforeAll(async () => {
    await FileSystem.remove(pathToLogDir);
});

afterAll(async () => {
    await FileSystem.remove(pathToLogDir);
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

    loggerService = await ObjectManager.get(LoggerService);

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

    expect(await FileSystem.readDirectory(pathToLogDir)).toEqual([
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

    expect(await FileSystem.readDirectory(path.join(pathToLogDir, 'component', 'container'))).toEqual([
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

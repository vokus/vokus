import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { Logger } from './logger';
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
    let logger: Logger = new Logger();

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

    logger = await ObjectManager.get(Logger);

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

    expect(await FileSystem.readDirectory(path.join(pathToLogDir, 'component', 'object-manager'))).toEqual([
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

import { Database } from './database';
import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { Logger } from './logger';
import { ObjectManager } from './object-manager';
import path from 'path';

const pathToLogDir = path.join(Environment.projectPath, 'var', Environment.context, 'log');

beforeAll(async () => {
    await FileSystem.remove(pathToLogDir);
});

afterAll(async () => {
    await FileSystem.remove(pathToLogDir);
});

test('logger', async () => {
    const logger1: Logger = new Logger();
    const logger2: Logger = await ObjectManager.get(Logger);

    await Promise.all([
        logger1.alert('alert message'),
        logger1.critical('critical message'),
        logger1.debug('debug message'),
        logger1.emergency('emergency message'),
        logger1.error('error message'),
        logger1.info('info message'),
        logger1.notice('notice message'),
        logger1.warning('warning message'),
        logger2.alert('alert message'),
        logger2.critical('critical message'),
        logger2.debug('debug message'),
        logger2.emergency('emergency message'),
        logger2.error('error message'),
        logger2.info('info message'),
        logger2.notice('notice message'),
        logger2.warning('warning message'),
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

    const database: Database = await ObjectManager.get(Database);
    await database.start();

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

    await database.stop();
});

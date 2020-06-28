import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { Injectable } from '../decorator/injectable';
import { Log } from '../entity/log';
import { LogRepository } from '../repository/log';
import { ObjectManager } from './object-manager';
import nodePath from 'path';

@Injectable()
export class Logger {
    protected _queueForDatabase: Log[] = [];

    async emergency(message: string): Promise<void> {
        await this.log(0, message);
    }

    async alert(message: string): Promise<void> {
        await this.log(1, message);
    }

    async critical(message: string): Promise<void> {
        await this.log(2, message);
    }

    async error(message: string): Promise<void> {
        await this.log(3, message);
    }

    async warning(message: string): Promise<void> {
        await this.log(4, message);
    }

    async notice(message: string): Promise<void> {
        await this.log(5, message);
    }

    async info(message: string): Promise<void> {
        await this.log(6, message);
    }

    async debug(message: string): Promise<void> {
        await this.log(7, message);
    }

    protected async log(code: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, message: string): Promise<void> {
        let contextType = undefined;
        let contextKey = undefined;

        // try to get context from meta data
        const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(this, '__meta');

        if (descriptor !== undefined) {
            contextType = descriptor.value.instantiatedBy.type;
            contextKey = descriptor.value.instantiatedBy.key;
        }

        const date = new Date();

        // trim message
        message = message.trim();

        // remove the path from the project for security reasons
        message = message.replace(new RegExp(Environment.projectPath + '/', 'g'), '');

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        const log = new Log(code, date, contextType, contextKey, message);

        await this._writeToFileSystem(log);
        await this._addLogToDatabaseQueue(log);
    }

    protected async _addLogToDatabaseQueue(log: Log): Promise<void> {
        this._queueForDatabase.push(log);

        await this._writeToDatabase();
    }

    protected async _writeToDatabase(): Promise<void> {
        const database = await ObjectManager.getDatabaseInstance();

        if (database === undefined || database.connection === undefined) {
            return;
        }

        const logRepository: LogRepository = await database.getRepository(LogRepository);

        const log = this._queueForDatabase.shift();

        if (log === undefined) {
            return;
        }

        await logRepository.save(log);

        await this._writeToDatabase();
    }

    protected async _writeToFileSystem(log: Log): Promise<void> {
        const logFilePaths = [
            nodePath.join(Environment.projectPath, 'var', Environment.context, 'log', log.level + '.log'),
        ];

        if (undefined !== log.contextKey && undefined !== log.contextType) {
            logFilePaths.push(
                nodePath.join(
                    Environment.projectPath,
                    'var',
                    Environment.context,
                    'log',
                    log.contextType,
                    log.contextKey,
                    log.level + '.log',
                ),
            );
        }

        const output = [];
        output.push('[' + this.dateToString(log.date) + ']');
        output.push('[' + log.level + ']');
        if (undefined !== log.contextKey && undefined !== log.contextType) {
            output.push('[' + log.contextType + '/' + log.contextKey + ']');
        }
        output.push('[' + log.message + ']');

        for (const logFilePath of logFilePaths) {
            // check if log file exists and create if not
            await FileSystem.ensureFileExists(logFilePath);

            // TODO: add log rotation
            // check if log rotation is necessary
            // await this._rotateLogFile(logFile);

            // write line to log file
            await FileSystem.appendFile(
                logFilePath,
                output
                    .join(' ')
                    .replace(/\r?\n?/g, '')
                    .trim() + '\n',
            );
        }
    }

    private dateToString(date: Date): string {
        return (
            date.getFullYear() +
            '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2) +
            ' ' +
            date.toTimeString().slice(0, 8)
        );
    }
}

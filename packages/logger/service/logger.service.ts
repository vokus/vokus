import { EnvironmentComponent } from '@vokus/environment';
import { LogEntity } from '../entity/log.entity';
import * as nodePath from 'path';
import { FileSystemComponent } from '@vokus/file-system';

export class LoggerService {
    public async emergency(message: string): Promise<void> {
        await this.log(0, message);
    }

    public async alert(message: string): Promise<void> {
        await this.log(1, message);
    }

    public async critical(message: string): Promise<void> {
        await this.log(2, message);
    }

    public async error(message: string): Promise<void> {
        await this.log(3, message);
    }

    public async warning(message: string): Promise<void> {
        await this.log(4, message);
    }

    public async notice(message: string): Promise<void> {
        await this.log(5, message);
    }

    public async info(message: string): Promise<void> {
        await this.log(6, message);
    }

    public async debug(message: string): Promise<void> {
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

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        const log = new LogEntity(code, date, contextType, contextKey, message);

        await this._writeLog(log);
    }

    protected async _writeLog(log: LogEntity): Promise<void> {
        const logFilePaths = [
            nodePath.join(
                EnvironmentComponent.projectPath,
                'var',
                EnvironmentComponent.context,
                'log',
                log.level + '.log',
            ),
        ];

        if (undefined !== log.contextKey && undefined !== log.contextType) {
            logFilePaths.push(
                nodePath.join(
                    EnvironmentComponent.projectPath,
                    'var',
                    EnvironmentComponent.context,
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
            await FileSystemComponent.ensureFileExists(logFilePath);

            // check if log rotation is necessary
            // await this._rotateLogFile(logFile);

            // write line to log file
            await FileSystemComponent.appendFile(
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

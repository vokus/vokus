import ServiceDecorator from '../decorator/service.decorator';
import StringUtil from '../util/string.util';
import LogEntity from '../entity/log.entity';
import ApplicationConfig from '../config/application.config';
import * as nodePath from 'path';
import { FileSystem } from '@vokus/component';

@ServiceDecorator()
export default class LoggerService {
    protected _applicationConfig: ApplicationConfig;
    protected _contextType: string;
    protected _contextName: string;

    public constructor(applicationConfig: ApplicationConfig, contextType: string, contextName: string) {
        this._applicationConfig = applicationConfig;

        contextType = contextType.toLowerCase();
        contextName = StringUtil.decamelize(contextName);
        contextName = contextName.replace('-' + contextType, '');

        this._contextType = contextType;
        this._contextName = contextName;
    }

    public async emergency(message: string, data?: any): Promise<void> {
        await this.log(0, message, data);
    }

    public async alert(message: string, data?: any): Promise<void> {
        await this.log(1, message, data);
    }

    public async critical(message: string, data?: any): Promise<void> {
        await this.log(2, message, data);
    }

    public async error(message: string, data?: any): Promise<void> {
        await this.log(3, message, data);
    }

    public async warning(message: string, data?: any): Promise<void> {
        await this.log(4, message, data);
    }

    public async notice(message: string, data?: any): Promise<void> {
        await this.log(5, message, data);
    }

    public async info(message: string, data?: any): Promise<void> {
        await this.log(6, message, data);
    }

    public async debug(message: string, data?: any): Promise<void> {
        await this.log(7, message, data);
    }

    protected async log(code: number, message: string, data?: any): Promise<void> {
        const date = new Date();

        // trim message
        message = message.trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // string type cast data
        if (undefined === data) {
            data = '';
        }

        data = StringUtil.cast(data);

        const log = new LogEntity(code, date, this._contextType, this._contextName, message, data);

        await Promise.all([this._writeLog(log), this._writeToConsole(log)]);
    }

    protected async _writeLog(log: LogEntity) {
        const logFilePaths = [
            nodePath.join(
                this._applicationConfig.rootPath,
                'var',
                this._applicationConfig.context,
                'log',
                log.level + '.log',
            ),
            nodePath.join(
                this._applicationConfig.rootPath,
                'var',
                this._applicationConfig.context,
                'log',
                log.contextType,
                log.contextName,
                log.level + '.log',
            ),
        ];

        const output = [];
        output.push('[' + this.dateToString(log.date) + ']');
        output.push('[' + log.level + ']');
        output.push('[' + log.contextType + '/' + log.contextName + ']');
        output.push('[' + log.message + ']');

        if (0 < log.data.length) {
            output.push('[' + log.data + ']');
        }

        for (const logFilePath of logFilePaths) {
            // check if log file exists and create if not
            await FileSystem.ensureFileExists(logFilePath);

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

    protected async _writeToConsole(log: LogEntity): Promise<void> {
        // disabled, if in context test or log level less then notice and in context production
        if (this._applicationConfig.isTest() || (this._applicationConfig.isProduction() && log.code > 5)) {
            return;
        }

        const output = [];
        output.push('[' + log.level + ']');
        output.push('[' + log.contextType + '/' + log.contextName + ']');
        output.push(log.message);

        if (0 < log.data.length) {
            output.push('[' + log.data + ']');
        }

        output.push('[pid:' + process.pid + ']');

        const colors: { [key: number]: string } = {
            0: '\x1b[31m',
            1: '\x1b[31m',
            2: '\x1b[31m',
            3: '\x1b[31m',
            4: '\x1b[33m',
            5: '\x1b[34m',
            6: '\x1b[34m',
            7: '\x1b[37m',
        };

        // tslint:disable-next-line
        console.log(
            colors[log.code],
            output
                .join(' ')
                .replace(/\r?\n?/g, '')
                .trim(),
            '\x1b[0m',
        );
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

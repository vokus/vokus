import * as https from 'https';
import * as path from 'path';
import { ServiceDecorator } from '@vokus/dependency-injection';
import { LoggerService } from '@vokus/logger';
import { HTTPServerConfig } from '../';
import { FileSystemComponent } from '../../file-system';
import { EnvironmentComponent } from '../../environment';

@ServiceDecorator()
export class HTTPServerService {
    protected _server: https.Server;
    protected _loggerService: LoggerService;
    protected _httpServerConfig: HTTPServerConfig;
    protected _key: string;
    protected _cert: string;

    constructor(loggerService: LoggerService, httpServerConfig: HTTPServerConfig) {
        this._httpServerConfig = httpServerConfig;
        this._loggerService = loggerService;
    }

    public async start(): Promise<void> {
        await this.readKeyAndCert();

        this._server = https.createServer(
            {
                key: this._key,
                cert: this._cert,
            },
            (req, res) => {
                res.writeHead(200);
                res.end('hello world\n');
            },
        );

        this._server.listen(3000);

        await this._loggerService.notice('started');
    }

    public async stop(): Promise<void> {
        this._server.close();
        await this._loggerService.notice('stopped');
    }

    protected async readKeyAndCert(): Promise<void> {
        const pathToKey = path.join(EnvironmentComponent.configPath, 'http-server/key.pem');
        const pathToCert = path.join(EnvironmentComponent.configPath, 'http-server/cert.pem');

        if (await FileSystemComponent.isFile(pathToKey)) {
            this._key = await FileSystemComponent.readFile(pathToKey);
        }

        if (await FileSystemComponent.isFile(pathToCert)) {
            this._cert = await FileSystemComponent.readFile(pathToCert);
        }

        // check if key and cert valid
        if (
            typeof this._key === 'string' &&
            this._key.length > 0 &&
            typeof this._cert === 'string' &&
            this._cert.length > 0
        ) {
            return;
        }

        // load self signed certificate if not in context production
        if (!EnvironmentComponent.isInContextProduction()) {
            this._key = await FileSystemComponent.readFile(path.join(__dirname, '../config/key.pem'));
            this._cert = await FileSystemComponent.readFile(path.join(__dirname, '../config/cert.pem'));
            this._loggerService.warning(`${pathToKey} or ${pathToCert} does not exists, use a self signed certificate`);
        }

        if (
            typeof this._key !== 'string' ||
            this._key.length === 0 ||
            typeof this._cert !== 'string' ||
            this._cert.length === 0
        ) {
            throw new Error(`cert or key does not exists or empty`);
        }
    }
}

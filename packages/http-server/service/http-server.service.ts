import * as https from 'https';
import { ServiceDecorator } from '@vokus/dependency-injection';
import { LoggerService } from '@vokus/logger';
import { HTTPServerConfig } from '../';

@ServiceDecorator()
export class HTTPServerService {
    protected _server: https.Server;
    protected _loggerService: LoggerService;
    protected _httpServerConfig: HTTPServerConfig;

    constructor(loggerService: LoggerService, httpServerConfig: HTTPServerConfig) {
        this._httpServerConfig = httpServerConfig;
        this._loggerService = loggerService;
    }

    public async start(): Promise<void> {
        this._server = https.createServer({}, (req, res) => {
            res.writeHead(200);
            res.end('hello world\n');
        });

        this._server.listen(8000);

        await this._loggerService.notice('started');
    }

    public async stop(): Promise<void> {
        this._server.close();
        await this._loggerService.notice('stopped');
    }
}

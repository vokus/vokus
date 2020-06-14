import express, { Application } from 'express';
import { EnvironmentComponent } from '../../environment';
import { FileSystemComponent } from '../../file-system';
import { HTTPServerConfig } from '../';
import { LoggerService } from '@vokus/logger';
import { MiddlewareConfigType } from '../type/middleware-config.type';
import { MiddlewareInterface } from '../interface/middleware.interface';
import { ServiceDecorator } from '@vokus/dependency-injection';
import https from 'https';
import path from 'path';

@ServiceDecorator()
export class HTTPServerService {
    protected _server: https.Server;
    protected _loggerService: LoggerService;
    protected _httpServerConfig: HTTPServerConfig;
    protected _express: Application;
    protected _selfSigned: boolean;
    protected _middlewares: MiddlewareConfigType[] = [];

    constructor(loggerService: LoggerService, httpServerConfig: HTTPServerConfig) {
        this._httpServerConfig = httpServerConfig;
        this._loggerService = loggerService;
    }

    async start(): Promise<void> {
        this._selfSigned = false;

        let pathToKey = path.join(EnvironmentComponent.configPath, 'http-server', 'key.pem');
        let pathToCert = path.join(EnvironmentComponent.configPath, 'http-server', 'cert.pem');

        // try to load certificate and key from config path
        if (!(await FileSystemComponent.isFile(pathToKey)) || !(await FileSystemComponent.isFile(pathToCert))) {
            this._loggerService.warning(
                `${pathToKey} or ${pathToCert} does not exists, a self-signed certificate is used`,
            );

            this._selfSigned = true;

            pathToKey = path.join(__dirname, '../self-signed-key.pem');
            pathToCert = path.join(__dirname, '../self-signed-cert.pem');
        }

        this._express = express();

        this.addMiddlewaresToExpress();

        this._server = https.createServer(
            {
                key: await FileSystemComponent.readFile(pathToKey),
                cert: await FileSystemComponent.readFile(pathToCert),
            },
            this._express,
        );

        this._server.listen(this._httpServerConfig.port);

        await this._loggerService.notice(`started with port ${this._httpServerConfig.port}`);
    }

    async stop(): Promise<void> {
        this._server.close();
        await this._loggerService.notice(`stopped with port ${this._httpServerConfig.port}`);
    }

    get selfSigned(): boolean {
        return this._selfSigned;
    }

    get middlewares(): MiddlewareConfigType[] {
        return this._middlewares;
    }

    get listening(): boolean {
        return 'object' === typeof this._server && this._server.listening;
    }

    async registerMiddleware(middleware: MiddlewareInterface, after?: string, before?: string): Promise<void> {
        this._middlewares.push({
            after: after,
            before: before,
            middleware: middleware,
        });
    }

    protected async addMiddlewaresToExpress(): Promise<void> {
        for (const middlewareConfig of this._middlewares) {
            this._express.use(middlewareConfig.middleware.handle.bind(middlewareConfig.middleware));
        }
    }
}

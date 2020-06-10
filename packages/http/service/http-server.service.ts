import express, { Application } from 'express';
import { EnvironmentComponent } from '../../environment';
import { FileSystemComponent } from '../../file-system';
import { HTTPServerConfig } from '../';
import { LoggerService } from '@vokus/logger';
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

    constructor(loggerService: LoggerService, httpServerConfig: HTTPServerConfig) {
        this._httpServerConfig = httpServerConfig;
        this._loggerService = loggerService;
    }

    public get selfSigned(): boolean {
        return this._selfSigned;
    }

    public async start(): Promise<void> {
        const pathToKey = path.join(EnvironmentComponent.configPath, 'http-server', 'key.pem');
        const pathToCert = path.join(EnvironmentComponent.configPath, 'http-server', 'cert.pem');

        let key = undefined;
        let cert = undefined;

        // try to load certificate and key from config path
        if ((await FileSystemComponent.isFile(pathToKey)) && (await FileSystemComponent.isFile(pathToCert))) {
            key = await FileSystemComponent.readFile(pathToKey);
            cert = await FileSystemComponent.readFile(pathToCert);
        }

        // load self signed certificate if not exists in config
        if ('string' !== typeof key || 0 === key.length || 'string' !== typeof cert || 0 === cert.length) {
            // throw exception if certicate and key does not exists in production context
            if (EnvironmentComponent.isInContextProduction()) {
                throw new Error(`${pathToKey} or ${pathToCert} does not exists`);
            }

            key = await FileSystemComponent.readFile(path.join(__dirname, '../self-signed-key.pem'));
            cert = await FileSystemComponent.readFile(path.join(__dirname, '../self-signed-cert.pem'));

            this._selfSigned = true;

            this._loggerService.warning(
                `${pathToKey} or ${pathToCert} does not exists, a self-signed certificate is used`,
            );
        } else {
            this._selfSigned = false;
        }

        this._express = express();

        this._server = https.createServer(
            {
                key: key,
                cert: cert,
            },
            this._express,
        );

        this._server.listen(this._httpServerConfig.port);

        await this._loggerService.notice(`started with port ${this._httpServerConfig.port}`);
    }

    public async stop(): Promise<void> {
        this._server.close();
        await this._loggerService.notice(`stopped with port ${this._httpServerConfig.port}`);
    }
}

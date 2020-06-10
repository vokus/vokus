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
    protected _key: string;
    protected _cert: string;
    protected _express: Application;

    constructor(loggerService: LoggerService, httpServerConfig: HTTPServerConfig) {
        this._httpServerConfig = httpServerConfig;
        this._loggerService = loggerService;
    }

    public async start(): Promise<void> {
        await this.readKeyAndCert();

        this._express = express();

        this._server = https.createServer(
            {
                key: this._key,
                cert: this._cert,
            },
            this._express,
        );

        this._server.listen(this._httpServerConfig.port);

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
            'string' === typeof this._key &&
            0 < this._key.length &&
            'string' === typeof this._cert &&
            0 < this._cert.length
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
            'string' !== typeof this._key ||
            0 === this._key.length ||
            'string' !== typeof this._cert ||
            0 === this._cert.length
        ) {
            throw new Error(`cert or key does not exists or empty`);
        }
    }
}

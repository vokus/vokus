import { Environment, EnvironmentVariable } from '@vokus/environment';
import express, { Application } from 'express';
import { FileSystem } from '../../file-system';
import { Injectable } from '@vokus/dependency-injection';
import { Logger } from '@vokus/logger';
import { MiddlewareConfigInterface } from '../interface/middleware-config';
import { RouteConfigInterface } from '../interface/route-config';
import https from 'https';
import path from 'path';

@Injectable()
export class HTTPServer {
    @EnvironmentVariable({
        name: 'HTTP_SERVER_PORT',
        example: 443,
        required: true,
        default: 443,
    })
    protected _port: number;

    protected _server: https.Server;
    protected _logger: Logger;
    protected _express: Application;
    protected _selfSigned: boolean;
    protected _middlewareConfiguration: MiddlewareConfigInterface[] = [];
    protected _routeConfiguration: RouteConfigInterface[] = [];

    constructor(logger: Logger) {
        this._logger = logger;
    }

    async start(): Promise<void> {
        this._selfSigned = false;

        let pathToKey = path.join(Environment.configPath, 'http-server', 'key.pem');
        let pathToCert = path.join(Environment.configPath, 'http-server', 'cert.pem');

        // try to load certificate and key from config path
        if (!(await FileSystem.isFile(pathToKey)) || !(await FileSystem.isFile(pathToCert))) {
            this._logger.warning(`${pathToKey} or ${pathToCert} does not exists, a self-signed certificate is used`);

            this._selfSigned = true;

            pathToKey = path.join(__dirname, '../self-signed-key.pem');
            pathToCert = path.join(__dirname, '../self-signed-cert.pem');
        }

        this._express = express();

        this._server = https.createServer(
            {
                key: await FileSystem.readFile(pathToKey),
                cert: await FileSystem.readFile(pathToCert),
            },
            this._express,
        );

        this._server.listen(this._port);

        await this._logger.notice(`started with port ${this._port}`);
    }

    async stop(): Promise<void> {
        this._server.close();
        await this._logger.notice(`stopped with port ${this._port}`);
    }

    get selfSigned(): boolean {
        return this._selfSigned;
    }

    get middlewareConfiguration(): MiddlewareConfigInterface[] {
        return this._middlewareConfiguration;
    }

    get listening(): boolean {
        return 'object' === typeof this._server && this._server.listening;
    }

    async addMiddlewareConfiguration(middlewareConfiguration: MiddlewareConfigInterface[]): Promise<void> {
        this._middlewareConfiguration = this._middlewareConfiguration.concat(middlewareConfiguration);
    }

    async addRouteConfiguration(routeConfiguration: RouteConfigInterface[]): Promise<void> {
        this._routeConfiguration = this._routeConfiguration.concat(routeConfiguration);
    }
}

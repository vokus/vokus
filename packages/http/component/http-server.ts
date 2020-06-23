import { Environment, EnvironmentVariable } from '@vokus/environment';
import { Injectable, ObjectManager } from '@vokus/dependency-injection';
import express, { Application } from 'express';
import { Array } from '@vokus/array';
import { ControllerInterface } from '../interface/controller';
import { FileSystem } from '@vokus/file-system';
import { HTTPConfigInterface } from '../interface/http-config';
import { Logger } from '@vokus/logger';
import { MiddlewareInterface } from '../interface/middleware';
import { RouteMiddleware } from '../middleware/route';
import { View } from '@vokus/view';
import https from 'https';
import path from 'path';

@Injectable()
export class HTTPServer {
    @EnvironmentVariable({
        default: 443,
        example: 443,
        name: 'HTTP_SERVER_PORT',
        required: true,
    })
    protected _port: number;

    protected _array: Array;
    protected _fileSystem: FileSystem;
    protected _view: View;
    protected _logger: Logger;
    protected _express: Application;
    protected _selfSigned: boolean;
    protected _config: HTTPConfigInterface = {
        middlewares: [],
        routes: [],
    };
    protected _server: https.Server;

    constructor(fileSystem: FileSystem, logger: Logger, view: View, array: Array) {
        this._fileSystem = fileSystem;
        this._logger = logger;
        this._view = view;
        this._array = array;
    }

    async start(): Promise<void> {
        this._selfSigned = false;

        let pathToKey = path.join(Environment.configPath, 'http-server', 'key.pem');
        let pathToCert = path.join(Environment.configPath, 'http-server', 'cert.pem');

        // try to load certificate and key from config path
        if (!(await this._fileSystem.isFile(pathToKey)) || !(await this._fileSystem.isFile(pathToCert))) {
            this._logger.warning(`${pathToKey} or ${pathToCert} does not exists, a self-signed certificate is used`);

            this._selfSigned = true;

            pathToKey = path.join(__dirname, '../self-signed-key.pem');
            pathToCert = path.join(__dirname, '../self-signed-cert.pem');
        }

        this._express = express();

        this._express.engine('pug', this._view.render.bind(this._view));
        this._express.set('view engine', 'pug');
        this._express.set('views', this._view.paths);

        await this._registerMiddlewares();

        this._server = https.createServer(
            {
                cert: await this._fileSystem.readFile(pathToCert),
                key: await this._fileSystem.readFile(pathToKey),
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

    async addConfig(config: HTTPConfigInterface): Promise<void> {
        this._config = Object.assign(this._config, config);
    }

    get listening(): boolean {
        return 'object' === typeof this._server && this._server.listening;
    }

    protected async _registerMiddlewares(): Promise<void> {
        // ensure fake router middleware exists
        let routerExists = false;

        if ('undefined' === typeof this._config.middlewares) {
            return;
        }

        for (const middlewareConfig of this._config.middlewares) {
            if ('router' === middlewareConfig.key) {
                routerExists = true;
                break;
            }
        }

        if (!routerExists) {
            this.addConfig({
                middlewares: [
                    {
                        key: 'router',
                        middleware: null,
                    },
                ],
            });
        }

        this._config.middlewares = await this._array.sortByBeforeAndAfter(this._config.middlewares);

        if ('undefined' === typeof this._config.middlewares) {
            return;
        }

        for (const middlewareConfig of this._config.middlewares) {
            if ('router' === middlewareConfig.key) {
                await this._registerRoutes();
                continue;
            }

            const middleware: MiddlewareInterface = await ObjectManager.get(middlewareConfig.middleware);

            this._express.use(middleware.handle.bind(middleware));
        }
    }

    protected async _registerRoutes(): Promise<void> {
        if ('undefined' === typeof this._config.routes) {
            return;
        }

        for (const routeConfiguration of this._config.routes) {
            const routeMiddleware: RouteMiddleware = new RouteMiddleware();

            const controller: ControllerInterface = await ObjectManager.get(routeConfiguration.controller);

            routeMiddleware.controller = controller;

            switch (routeConfiguration.method) {
                case 'get':
                    this._express.get(routeConfiguration.path, routeMiddleware.handle.bind(routeMiddleware));
                    break;
                case 'post':
                    this._express.post(routeConfiguration.path, routeMiddleware.handle.bind(routeMiddleware));
                    break;
                case 'put':
                    this._express.put(routeConfiguration.path, routeMiddleware.handle.bind(routeMiddleware));
                    break;
                case 'delete':
                    this._express.delete(routeConfiguration.path, routeMiddleware.handle.bind(routeMiddleware));
                    break;
            }
        }
    }
}

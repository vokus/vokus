import { ArrayUtil, ObjectUtil } from '@vokus/util';
import { Environment, EnvironmentVariable } from '@vokus/environment';
import { Injectable, ObjectManager } from '@vokus/dependency-injection';
import express, { Application } from 'express';
import { ControllerInterface } from '../interface/controller';
import { FileSystem } from '@vokus/file-system';
import { HttpConfigInterface } from '../interface/http-config';
import { Logger } from '@vokus/logger';
import { MiddlewareConfigInterface } from '../interface/middleware-config';
import { MiddlewareInterface } from '../interface/middleware';
import { RouteMiddleware } from '../middleware/route';
import { StaticMiddleware } from '../middleware/static';
import { View } from '@vokus/view';
import https from 'https';
import path from 'path';

@Injectable()
export class HttpServer {
    @EnvironmentVariable({
        default: 443,
        example: 443,
        name: 'HTTP_SERVER_PORT',
        required: true,
    })
    protected _port: number;

    protected _fileSystem: FileSystem;
    protected _view: View;
    protected _logger: Logger;
    protected _express: Application;
    protected _selfSigned: boolean;
    protected _config: HttpConfigInterface = {
        middlewares: [],
        publicPaths: [],
        routes: [],
    };
    protected _server: https.Server;

    constructor(fileSystem: FileSystem, logger: Logger, view: View) {
        this._fileSystem = fileSystem;
        this._logger = logger;
        this._view = view;
    }

    get config(): HttpConfigInterface {
        return this._config;
    }

    async start(): Promise<void> {
        await this._setupExpress();

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

        await this._processConfig();

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

    protected async _setupExpress(): Promise<void> {
        this._express = express();

        // enable strict routing - means /route is not the same like /route/
        this._express.enable('strict routing');

        // register custom pug renderer
        this._express.engine('pug', this._view.render.bind(this._view));

        // set view engine to pug
        this._express.set('view engine', 'pug');

        // register view paths
        this._express.set('views', this._view.config.paths);
    }

    async stop(): Promise<void> {
        this._server.close();
        await this._logger.notice(`stopped with port ${this._port}`);
    }

    get selfSigned(): boolean {
        return this._selfSigned;
    }

    async addConfig(config: HttpConfigInterface): Promise<void> {
        await ObjectUtil.merge(this._config, config);
    }

    get listening(): boolean {
        return 'object' === typeof this._server && this._server.listening;
    }

    protected async _processConfig(): Promise<void> {
        this._config.middlewares = await ArrayUtil.sortByBeforeAndAfter(this._config.middlewares);

        for (const middlewareConfig of this._config.middlewares) {
            if (
                middlewareConfig.middleware === RouteMiddleware ||
                RouteMiddleware.isPrototypeOf(middlewareConfig.middleware)
            ) {
                await this._processRoutes(middlewareConfig);

                continue;
            }

            if (
                middlewareConfig.middleware === StaticMiddleware ||
                StaticMiddleware.isPrototypeOf(middlewareConfig.middleware)
            ) {
                for (const publicPath of this._config.publicPaths) {
                    const staticMiddleware: StaticMiddleware = new middlewareConfig.middleware();
                    staticMiddleware.path = publicPath;
                    this._express.use(staticMiddleware.handle.bind(staticMiddleware));
                }

                continue;
            }

            const middleware: MiddlewareInterface = await ObjectManager.get(middlewareConfig.middleware);

            this._express.use(middleware.handle.bind(middleware));
        }
    }

    protected async _processRoutes(middlewareConfig: MiddlewareConfigInterface): Promise<void> {
        for (const routeConfiguration of this._config.routes) {
            const routeMiddleware: any = new middlewareConfig.middleware();

            const controller: ControllerInterface = await ObjectManager.get(routeConfiguration.controller);

            routeMiddleware.controller = controller;

            this._express[routeConfiguration.method](
                routeConfiguration.path,
                routeMiddleware.handle.bind(routeMiddleware),
            );
        }
    }
}

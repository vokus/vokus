import { Environment, EnvironmentVariable } from '@vokus/environment';
import { Injectable, ObjectManager } from '@vokus/dependency-injection';
import express, { Application } from 'express';
import { Array } from '@vokus/array';
import { ControllerInterface } from '../interface/controller';
import { FileSystem } from '@vokus/file-system';
import { Logger } from '@vokus/logger';
import { MiddlewareConfigurationInterface } from '../interface/middleware-configuration';
import { MiddlewareInterface } from '../interface/middleware';
import { RouteConfigurationInterface } from '../interface/route-configuration';
import { RouteMiddleware } from '../middleware/route';
import { Template } from '@vokus/template';
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
    protected _template: Template;
    protected _server: https.Server;
    protected _logger: Logger;
    protected _express: Application;
    protected _selfSigned: boolean;
    protected _middlewareConfiguration: MiddlewareConfigurationInterface[] = [];
    protected _routeConfiguration: RouteConfigurationInterface[] = [];

    constructor(fileSystem: FileSystem, logger: Logger, template: Template, array: Array) {
        this._fileSystem = fileSystem;
        this._logger = logger;
        this._template = template;
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

        this._express.engine('pug', this._template.render.bind(this._template));
        this._express.set('view engine', 'pug');
        this._express.set('views', this._template.paths);

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

    get middlewareConfiguration(): MiddlewareConfigurationInterface[] {
        return this._middlewareConfiguration;
    }

    get listening(): boolean {
        return 'object' === typeof this._server && this._server.listening;
    }

    async addMiddlewareConfiguration(middlewareConfiguration: MiddlewareConfigurationInterface[]): Promise<void> {
        this._middlewareConfiguration = this._middlewareConfiguration.concat(middlewareConfiguration);
    }

    async addRouteConfiguration(routeConfiguration: RouteConfigurationInterface[]): Promise<void> {
        this._routeConfiguration = this._routeConfiguration.concat(routeConfiguration);
    }

    protected async _registerMiddlewares(): Promise<void> {
        // ensure fake router middleware exists
        let routerExists = false;
        for (const middlewareConfig of this._middlewareConfiguration) {
            if ('router' === middlewareConfig.key) {
                routerExists = true;
                break;
            }
        }

        if (!routerExists) {
            await this.addMiddlewareConfiguration([
                {
                    key: 'router',
                    middleware: null,
                },
            ]);
        }

        this._middlewareConfiguration = await this._array.sortByBeforeAndAfter(this._middlewareConfiguration);

        for (const middlewareConfig of this._middlewareConfiguration) {
            if ('router' === middlewareConfig.key) {
                await this._registerRoutes();
                continue;
            }

            const middleware: MiddlewareInterface = await ObjectManager.get(middlewareConfig.middleware);

            this._express.use(middleware.handle.bind(middleware));
        }
    }

    protected async _registerRoutes(): Promise<void> {
        for (const routeConfiguration of this._routeConfiguration) {
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

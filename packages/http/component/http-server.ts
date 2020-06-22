import { Environment, EnvironmentVariable } from '@vokus/environment';
import { Injectable, ObjectManager } from '@vokus/dependency-injection';
import express, { Application } from 'express';
import { ControllerInterface } from '../interface/controller';
import { FileSystem } from '@vokus/file-system';
import { Logger } from '@vokus/logger';
import { MiddlewareConfigurationInterface } from '../interface/middleware-configuration';
import { MiddlewareInterface } from '../interface/middleware';
import { RouteConfigurationInterface } from '../interface/route-configuration';
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

    protected _fileSystem: FileSystem;
    protected _template: Template;
    protected _server: https.Server;
    protected _logger: Logger;
    protected _express: Application;
    protected _selfSigned: boolean;
    protected _middlewareConfiguration: MiddlewareConfigurationInterface[] = [];
    protected _routeConfiguration: RouteConfigurationInterface[] = [];

    constructor(fileSystem: FileSystem, logger: Logger, template: Template) {
        this._fileSystem = fileSystem;
        this._logger = logger;
        this._template = template;
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

        // TODO: sort middlewares by after and before

        this._sortBeforeAfter(this._middlewareConfiguration);

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
            const controller: ControllerInterface = await ObjectManager.get(routeConfiguration.controller);

            switch (routeConfiguration.method) {
                case 'get':
                    this._express.get(routeConfiguration.path, controller.handle.bind(controller));
                    break;
                case 'post':
                    this._express.post(routeConfiguration.path, controller.handle.bind(controller));
                    break;
                case 'put':
                    this._express.put(routeConfiguration.path, controller.handle.bind(controller));
                    break;
                case 'delete':
                    this._express.delete(routeConfiguration.path, controller.handle.bind(controller));
                    break;
            }
        }
    }

    protected async _sortBeforeAfter(items: { before?: string; key: string; after?: string }[]): Promise<any> {
        const keys: string[] = [];

        // TODO: refactor to array utility / remove duplicate entries with same key

        // add key to keys
        for (const item of items) {
            if ('undefined' !== typeof item.after) {
                if (!keys.includes(item.after)) {
                    keys.push(item.after);
                } else {
                    if (keys.includes(item.key)) {
                        keys.splice(keys.indexOf(item.key), 1);
                    }
                    keys.splice(keys.indexOf(item.after) + 1, 0, item.key);
                }
            }

            if (!keys.includes(item.key)) {
                keys.push(item.key);
            }

            if ('undefined' !== typeof item.before) {
                if (!keys.includes(item.before)) {
                    keys.push(item.before);
                } else {
                    if (keys.includes(item.key)) {
                        keys.splice(keys.indexOf(item.key), 1);
                    }
                    keys.splice(keys.indexOf(item.before) - 1, 0, item.key);
                }
            }
        }

        const newItems = [];

        for (const key of keys) {
            for (const item of items) {
                if (key === item.key) {
                    newItems.push(item);
                }
            }
        }
    }
}

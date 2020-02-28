import { createServer, Server } from 'https';
import express from 'express';
import ServiceDecorator from '../decorator/service.decorator';
import LoggerService from './logger.service';
import ServerConfig from '../config/server.config';

// TODO: certificates
@ServiceDecorator()
export default class HTTPServerService {
    protected _server: Server;
    protected _connection: Server | undefined;
    protected _logger: LoggerService;
    protected _serverConfig: ServerConfig;

    constructor(serverConfig: ServerConfig, logger: LoggerService) {
        this._logger = logger;
        this._serverConfig = serverConfig;

        this._server = createServer(
            {
                // cert: await FileSystem.readFile(this.pathToCertPem),
                // key: await FileSystem.readFile(this.pathToKeyPem),
            },
            express(),
        );
    }

    public async start(): Promise<boolean> {
        return await this.listen(this._serverConfig.port);
    }

    public async stop(): Promise<boolean> {
        try {
            await new Promise((resolve, reject) => {
                if (undefined === this._connection) {
                    reject();
                } else {
                    this._connection.close(resolve);
                }
            });
        } catch (err) {
            await this._logger.error('http server already stopped');
            return false;
        }

        delete this._connection;
        await this._logger.notice('http server stopped');

        return true;
    }

    public get port(): number | undefined {
        if (undefined === this._connection) {
            return undefined;
        }

        const address = this._connection.address();

        if ('object' === typeof address && null !== address) {
            return address.port;
        }

        return undefined;
    }

    protected async listen(port: number): Promise<boolean> {
        if (undefined !== this.port) {
            await this._logger.error('http server already listen');
            return false;
        }

        try {
            await new Promise((resolve, reject) => {
                this._connection = this._server
                    .listen({ port }, () => {
                        resolve();
                    })
                    .on('error', reject);
            });
        } catch (err) {
            await this._logger.warning(`cannot listen on port ${port} - try to start server on port ${port + 1}`);
            return await this.listen(port + 1);
        }

        return true;
    }
}

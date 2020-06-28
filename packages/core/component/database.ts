import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { DatabaseConfigInterface } from '../interface/database-config';
import { Environment } from '@vokus/environment';
import { Injectable } from '../decorator/injectable';
import { Log } from '../entity/log';
import { Logger } from './logger';
import { ObjectUtil } from '@vokus/util';
import path from 'path';

@Injectable()
export class Database {
    protected _config: DatabaseConfigInterface;
    protected _connection: Connection | undefined;
    protected _logger: Logger;

    constructor(logger: Logger) {
        this._logger = logger;

        this._config = {
            database: path.join(Environment.projectPath, 'var', Environment.context, 'database.sqlite'),
            entities: [Log],
            type: 'sqlite',
        };
    }

    async addConfig(config: DatabaseConfigInterface): Promise<void> {
        await ObjectUtil.merge(this._config, config);
    }

    async start(): Promise<void> {
        let options: ConnectionOptions;

        switch (this._config.type) {
            case 'mysql':
                options = {
                    database: this._config.database,
                    entities: this._config.entities,
                    host: this._config.host,
                    password: this._config.password,
                    type: this._config.type,
                    username: this._config.username,
                };

                break;
            case 'sqlite':
                options = {
                    database: this._config.database,
                    entities: this._config.entities,
                    type: this._config.type,
                };

                break;
        }

        Object.assign(options, {
            synchronize: true,
        });

        this._connection = await createConnection(options);

        if (!(this._connection instanceof Connection)) {
            this._connection = undefined;
            await this._logger.critical(`can not connect to db "${this._config.database}"`);
        } else {
            await this._logger.notice(`connected to db "${this._config.database}"`);
        }
    }

    get connection(): Connection | undefined {
        return this._connection;
    }

    async getRepository(repository: any): Promise<any | undefined> {
        if (undefined === this._connection) {
            return undefined;
        }
        return this._connection.getCustomRepository(repository);
    }

    async drop(): Promise<boolean> {
        if (undefined === this._connection) {
            return false;
        }

        await this._connection.dropDatabase();
        await this._connection.synchronize();

        return true;
    }

    async stop(): Promise<boolean> {
        if (undefined === this._connection) {
            return false;
        }

        await this._connection.close();

        return true;
    }
}

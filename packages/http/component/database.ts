import { Connection, ConnectionOptions, Repository, createConnection } from 'typeorm';
import { DatabaseConfigInterface } from '../index';
import { Environment } from '@vokus/environment';
import { Injectable } from '@vokus/dependency-injection';
import { ObjectUtil } from '@vokus/util';
import path from 'path';

@Injectable()
export class Database {
    protected _config: DatabaseConfigInterface;
    protected _connected = false;
    protected _connection: Connection;

    constructor() {
        this._config = {
            database: path.join(Environment.projectPath, 'var/database/database.sqlite'),
            entities: [],
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

        Object.assign(this._config, {
            synchronize: true,
        });

        this._connection = await createConnection(options);

        if (null === this._connection) {
            // await this._logger.critical(`can not connect to db "${this._config.database}"`);
        } else {
            this._connected = true;
            // await this._logger.notice(`connected to db "${this._config.database}"`);
        }
    }

    get connected(): boolean {
        return this._connected;
    }

    getRepository(type: any): Repository<any> {
        return this._connection.getRepository(type);
    }

    async drop(): Promise<void> {
        await this._connection.dropDatabase();
        await this._connection.synchronize();
    }

    async stop(): Promise<boolean> {
        if (undefined === this._connection) {
            return false;
        }

        await this._connection.close();

        return true;
    }
}

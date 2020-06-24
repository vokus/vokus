import { ConfigInterface } from '../interface/config';
import { HttpServer } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';
import { ObjectUtil } from '@vokus/util';
import { View } from '@vokus/view';

@Injectable()
export class Application {
    protected _httpServer: HttpServer;
    protected _view: View;
    protected _config: ConfigInterface = {};

    constructor(httpServer: HttpServer, view: View) {
        this._httpServer = httpServer;
        this._view = view;
    }

    async addConfig(config: ConfigInterface): Promise<void> {
        ObjectUtil.merge(this._config, config);
    }

    async start() {
        if ('undefined' !== typeof this._config.view) {
            await this._view.addConfig(this._config.view);
        }

        if ('undefined' !== typeof this._config.http) {
            await this._httpServer.addConfig(this._config.http);
        }

        await this._view.start();
        await this._httpServer.start();
    }

    async stop() {
        await this._httpServer.stop();
    }
}

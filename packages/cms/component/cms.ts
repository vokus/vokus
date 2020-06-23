import { ConfigInterface } from '../interface/config';
import { HTTPServer } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';
import { View } from '@vokus/view';

@Injectable()
export class CMS {
    protected _httpServer: HTTPServer;
    protected _view: View;
    protected _config: ConfigInterface = {};

    constructor(httpServer: HTTPServer, view: View) {
        this._httpServer = httpServer;
        this._view = view;
    }

    async addConfiguration(config: ConfigInterface): Promise<void> {
        this._config = Object.assign({}, config);
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

import { Asset, HttpServer, Injectable, View } from '@vokus/core';
import { AppConfigInterface } from '../interface/app-config';
import { ObjectUtil } from '@vokus/util';

@Injectable()
export class App {
    protected _httpServer: HttpServer;
    protected _view: View;
    protected _asset: Asset;
    protected _config: AppConfigInterface = {};

    constructor(asset: Asset, httpServer: HttpServer, view: View) {
        this._asset = asset;
        this._httpServer = httpServer;
        this._view = view;
    }

    async addConfig(config: AppConfigInterface): Promise<void> {
        await ObjectUtil.merge(this._config, config);
    }

    async start() {
        if (undefined !== this._config.view) {
            await this._view.addConfig(this._config.view);
        }

        if (undefined !== this._config.http) {
            await this._httpServer.addConfig(this._config.http);
        }

        if (undefined !== this._config.asset) {
            await this._asset.addConfig(this._config.asset);
        }

        await this._asset.start();
        await this._view.start();
        await this._httpServer.start();
    }

    async stop() {
        await this._httpServer.stop();
    }
}

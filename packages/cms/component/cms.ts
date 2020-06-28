import { HttpServer, View } from '@vokus/core';
import { CmsConfigInterface } from '../interface/cms-config';
import { Injectable } from '@vokus/dependency-injection';
import { ObjectUtil } from '@vokus/util';

@Injectable()
export class Cms {
    protected _httpServer: HttpServer;
    protected _view: View;
    protected _config: CmsConfigInterface = {};

    constructor(httpServer: HttpServer, view: View) {
        this._httpServer = httpServer;
        this._view = view;
    }

    async addConfig(config: CmsConfigInterface): Promise<void> {
        await ObjectUtil.merge(this._config, config);
    }

    async start() {
        if (undefined !== this._config.view) {
            await this._view.addConfig(this._config.view);
        }

        if (undefined !== this._config.http) {
            await this._httpServer.addConfig(this._config.http);
        }

        await this._view.start();
        await this._httpServer.start();
    }

    async stop() {
        await this._httpServer.stop();
    }
}

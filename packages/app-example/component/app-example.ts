import { App, AppConfig } from '@vokus/app';
import { AppExampleConfig } from '../config/app-example';
import { Injectable } from '@vokus/core';

@Injectable()
export class AppExample {
    protected _app: App;

    constructor(app: App) {
        this._app = app;
    }

    async start() {
        await this._app.addConfig(AppConfig);
        await this._app.addConfig(AppExampleConfig);
        await this._app.start();
    }

    async stop() {
        await this._app.stop();
    }
}

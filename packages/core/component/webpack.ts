import { Injectable } from '../decorator/injectable';
import { ObjectUtil } from '@vokus/util';
import { WebpackConfigInterface } from '../interface/webpack-config';
import webpack from 'webpack';

@Injectable()
export class Webpack {
    protected _config: WebpackConfigInterface = {};

    get config(): WebpackConfigInterface {
        return this._config;
    }

    async addConfig(config: WebpackConfigInterface): Promise<void> {
        await ObjectUtil.merge(this._config, config);
    }

    async start(): Promise<void> {
        if (this._config.configs === undefined) {
            return;
        }

        for (const config of this._config.configs) {
            console.log(config);

            webpack(config);
        }
    }
}

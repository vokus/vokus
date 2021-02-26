import { AssetConfigInterface } from '../interface/asset-config';
import { Environment } from '@vokus/environment';
import { Injectable } from '../decorator/injectable';
import { ObjectUtil } from '@vokus/util';
import nodePath from 'path';
import webpack from 'webpack';

@Injectable()
export class Asset {
    protected _config: AssetConfigInterface = {};

    get config(): AssetConfigInterface {
        return this._config;
    }

    async addConfig(config: AssetConfigInterface): Promise<void> {
        await ObjectUtil.merge(this._config, config);
    }

    async webpack(key: string, path: string) {
        const config: webpack.Configuration = {
            entry: [nodePath.resolve(path, 'js/app.ts')],
            mode: 'production',
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: ['style-loader', 'css-loader', 'sass-loader'],
                    },
                    {
                        test: /\.woff2$/,
                        use: {
                            loader: 'file-loader',
                            options: {
                                include: nodePath.resolve(path, 'font'),
                                name: '[name].[ext]',
                                outputPath: './font/',
                            },
                        },
                    },
                ],
            },
            output: {
                filename: './js/app.js',
                path: nodePath.resolve(Environment.projectPath, 'public/asset/', key),
            },
        };

        webpack(config, (err, stats) => {
            if (err || (undefined !== stats && stats.hasErrors())) {
                // TODO: handle errors
                console.log(err);
            }
        });
    }

    async start(): Promise<void> {
        if (this._config.paths === undefined) {
            return;
        }

        for (const entry of this._config.paths) {
            await this.webpack(entry.key, entry.path);
        }

        return;
    }
}

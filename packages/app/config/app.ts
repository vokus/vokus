import {
    AccessLoggerMiddleware,
    AssetViewHelper,
    CookieParserMiddleware,
    ErrorMiddleware,
    NotFoundMiddleware,
    RouteMiddleware,
    StaticMiddleware,
    TranslateViewHelper,
    UrlViewHelper,
} from '@vokus/core';
import { AppConfigInterface } from '../interface/app-config';
import { VokusDesignListController } from '../controller/vokus/design/list';
import { VokusUserSignInController } from '../controller/vokus/user/sign-in';
import path from 'path';

export const AppConfig: AppConfigInterface = {
    http: {
        middlewares: [
            {
                after: 'access-logger',
                before: 'cookie-parser',
                key: 'static',
                middleware: StaticMiddleware,
            },
            {
                before: 'route',
                key: 'cookie-parser',
                middleware: CookieParserMiddleware,
            },
            {
                before: 'route',
                key: 'access-logger',
                middleware: AccessLoggerMiddleware,
            },
            {
                key: 'route',
                middleware: RouteMiddleware,
            },
            {
                after: 'route',
                key: 'not-found',
                middleware: NotFoundMiddleware,
            },
            {
                after: 'not-found',
                key: 'error',
                middleware: ErrorMiddleware,
            },
        ],
        port: 3000,
        publicPath: path.resolve(__dirname, 'public'),
        routes: [
            {
                controller: VokusDesignListController,
                key: 'vokus/design/list',
                method: 'get',
                path: '/vokus/design/list',
            },
            {
                controller: VokusUserSignInController,
                key: 'vokus/user/sign-in',
                method: 'get',
                path: '/vokus/user/sign-in',
            },
        ],
    },
    view: {
        helpers: [
            {
                helper: AssetViewHelper,
                key: 'asset',
            },
            {
                helper: TranslateViewHelper,
                key: 'translate',
            },
            {
                helper: UrlViewHelper,
                key: 'url',
            },
        ],
        paths: [path.join(__dirname, '../view/template')],
    },
    webpack: {
        configs: [
            {
                entry: [path.resolve(__dirname, '../assets/js/app.ts')],
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
                                    include: path.resolve(__dirname, '../assets/font'),
                                    name: '[name].[ext]',
                                    outputPath: './font/',
                                },
                            },
                        },
                    ],
                },
                output: {
                    filename: './js/app.js',
                    path: path.resolve(__dirname, '../public/assets/app'),
                },
            },
        ],
    },
};

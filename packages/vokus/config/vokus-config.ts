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
} from '@vokus/http';
import { ConfigInterface } from '../interface/config';
import { DesignController } from '../controller/vokus/design';
import { SignInController } from '../controller/user/sign-in';
import path from 'path';

export const VokusConfig: ConfigInterface = {
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
        publicPaths: [path.join(__dirname, '../public')],
        routes: [
            {
                controller: DesignController,
                key: 'vokus/design',
                method: 'get',
                path: '/vokus/design',
            },
            {
                controller: SignInController,
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
};

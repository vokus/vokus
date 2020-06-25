import {
    AccessLoggerMiddleware,
    CookieParserMiddleware,
    ErrorMiddleware,
    NotFoundMiddleware,
    RouteMiddleware,
    StaticMiddleware,
    UrlViewHelper,
} from '@vokus/http';
import { AssetViewHelper, TranslateViewHelper } from '@vokus/view';
import { ConfigInterface } from '../interface/config';
import { SignInController } from '../controller/user/sign-in';
import path from 'path';

export const CoreConfig: ConfigInterface = {
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
        publicPaths: [path.join(__dirname, '../public')],
        routes: [
            {
                controller: SignInController,
                key: 'user/sign-in',
                method: 'get',
                path: '/user/sign-in',
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

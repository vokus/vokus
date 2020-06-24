import {
    AccessLoggerMiddleware,
    CookieParserMiddleware,
    ErrorMiddleware,
    NotFoundMiddleware,
    StaticMiddleware,
} from '@vokus/http';
import { ConfigInterface } from '../interface/config';
import { SignInController } from '../controller/user/sign-in';
import path from 'path';

export const Config: ConfigInterface = {
    http: {
        middlewares: [
            {
                before: 'access-logger',
                key: 'static',
                middleware: StaticMiddleware,
            },
            {
                before: 'router',
                key: 'cookie-parser',
                middleware: CookieParserMiddleware,
            },
            {
                before: 'router',
                key: 'access-logger',
                middleware: AccessLoggerMiddleware,
            },
            {
                after: 'router',
                key: 'not-found',
                middleware: NotFoundMiddleware,
            },
            {
                after: 'not-found',
                key: 'error',
                middleware: ErrorMiddleware,
            },
        ],
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
        paths: [path.join(__dirname, '../view/template')],
    },
};

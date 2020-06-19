import {
    AccessLoggerMiddleware,
    CookieParserMiddleware,
    MiddlewareConfigInterface,
    RouteConfigInterface,
} from '@vokus/http';
import { SignInController } from './controller/user/sign-in';

export const CMSRoutes: RouteConfigInterface[] = [
    {
        controller: SignInController,
        key: 'user/sign-in',
        method: 'get',
        path: 'user/sign-in',
    },
];

export const CMSMiddlewares: MiddlewareConfigInterface[] = [
    {
        key: 'cookie-parser',
        middleware: CookieParserMiddleware,
    },
    {
        key: 'access-logger',
        middleware: AccessLoggerMiddleware,
    },
];

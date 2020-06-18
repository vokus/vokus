import {
    AccessLoggerMiddleware,
    CookieParserMiddleware,
    MiddlewareConfigInterface,
    RouteConfigInterface,
} from '@vokus/http';
import { SignInController } from './controller/user/sign-in';

export const CMSRoutes: RouteConfigInterface[] = [
    {
        key: 'user/sign-in',
        path: 'user/sign-in',
        controller: SignInController,
    },
];

export const CMSMiddlewares: MiddlewareConfigInterface[] = [
    {
        key: 'cookie-parser',
        controller: CookieParserMiddleware,
    },
    {
        key: 'access-logger',
        controller: AccessLoggerMiddleware,
    },
];

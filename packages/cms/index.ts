import {
    AccessLoggerMiddleware,
    CookieParserMiddleware,
    MiddlewareConfigurationInterface,
    RouteConfigurationInterface,
} from '@vokus/http';
import { SignInController } from './controller/user/sign-in';
import { TemplateConfigurationInterface } from '../template/interface/template-configuration';

export const CMSRoutes: RouteConfigurationInterface[] = [
    {
        controller: SignInController,
        key: 'user/sign-in',
        method: 'get',
        path: '/user/sign-in',
    },
];

export const CMSMiddlewares: MiddlewareConfigurationInterface[] = [
    {
        key: 'cookie-parser',
        middleware: CookieParserMiddleware,
    },
    {
        key: 'access-logger',
        middleware: AccessLoggerMiddleware,
    },
];

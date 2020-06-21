import {
    AccessLoggerMiddleware,
    CookieParserMiddleware,
    MiddlewareConfigurationInterface,
    RouteConfigurationInterface,
    StatusCode404Middleware,
} from '@vokus/http';
import { SignInController } from './controller/user/sign-in';
import { TemplateConfigurationInterface } from '@vokus/template';
import path from 'path';

export const CMSRouteConfiguration: RouteConfigurationInterface[] = [
    {
        controller: SignInController,
        key: 'user/sign-in',
        method: 'get',
        path: '/user/sign-in',
    },
];

export const CMSMiddlewareConfiguration: MiddlewareConfigurationInterface[] = [
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
        key: 'status-code-404',
        middleware: StatusCode404Middleware,
    },
];

export const CMSTemplateConfiguration: TemplateConfigurationInterface = {
    paths: [path.join(__dirname + 'view/template')],
};

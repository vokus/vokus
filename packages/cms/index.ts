import {
    AccessLoggerMiddleware,
    CookieParserMiddleware,
    ErrorMiddleware,
    MiddlewareConfigurationInterface,
    NotFoundMiddleware,
    RouteConfigurationInterface,
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
        key: 'not-found',
        middleware: NotFoundMiddleware,
    },
    {
        after: 'not-found',
        key: 'error',
        middleware: ErrorMiddleware,
    },
];

export const CMSTemplateConfiguration: TemplateConfigurationInterface = {
    viewPaths: [path.join(__dirname, 'view/template')],
};

import { AccessLoggerMiddleware, CookieParserMiddleware } from '@vokus/http';
import { SignInController } from './controller/user/sign-in';

export const CMSRoutes = {
    'typecast/user/sign-in': {
        path: 'typecast/user/sign-in',
        controller: SignInController,
    },
};

export const CMSMiddlewares = {
    'vokus/cookie-parser': {
        controller: CookieParserMiddleware,
    },
    'vokus/access-logger': {
        controller: AccessLoggerMiddleware,
    },
};

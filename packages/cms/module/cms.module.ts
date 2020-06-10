import { CookieParserMiddleware, HTTPServerService } from '@vokus/http';

export class CMSModule {
    protected _serverService: HTTPServerService;
    protected _cookieParserMiddleware: CookieParserMiddleware;

    constructor(serverService: HTTPServerService, cookieParserMiddleware: CookieParserMiddleware) {
        this._serverService = serverService;
        this._cookieParserMiddleware = cookieParserMiddleware;

        this._serverService.registerMiddleware(cookieParserMiddleware);
    }
}

import { CookieParserMiddleware, HTTPServerService } from '@vokus/http';

export class CMSService {
    protected _httpServerService: HTTPServerService;
    protected _cookieParserMiddleware: CookieParserMiddleware;

    constructor(httpServerService: HTTPServerService, cookieParserMiddleware: CookieParserMiddleware) {
        this._httpServerService = httpServerService;
        this._cookieParserMiddleware = cookieParserMiddleware;
    }

    public async start(): Promise<void> {
        await this._httpServerService.registerMiddleware(this._cookieParserMiddleware);
    }
}

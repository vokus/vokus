import { AccessLogMiddleware, CookieParserMiddleware, HTTPServerService } from '@vokus/http';
import { ServiceDecorator } from '@vokus/dependency-injection';

@ServiceDecorator()
export class CMSService {
    protected _httpServerService: HTTPServerService;
    protected _accessLogMiddleware: AccessLogMiddleware;
    protected _cookieParserMiddleware: CookieParserMiddleware;

    constructor(
        httpServerService: HTTPServerService,
        accessLogMiddleware: AccessLogMiddleware,
        cookieParserMiddleware: CookieParserMiddleware,
    ) {
        this._httpServerService = httpServerService;
        this._cookieParserMiddleware = cookieParserMiddleware;
        this._accessLogMiddleware = accessLogMiddleware;
    }

    public async start(): Promise<void> {
        await this._httpServerService.registerMiddleware(this._accessLogMiddleware);
        await this._httpServerService.registerMiddleware(this._cookieParserMiddleware);
    }
}

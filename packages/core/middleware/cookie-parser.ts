import { Injectable } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware';
import { Request } from '../core/request';
import { Response } from '../core/response';
import cookieParser from 'cookie-parser';

@Injectable()
export class CookieParserMiddleware implements MiddlewareInterface {
    protected _cookieParser: any;

    constructor() {
        this._cookieParser = cookieParser();
    }

    async handle(req: Request, res: Response, next: () => void): Promise<void> {
        return this._cookieParser(req, res, next);
    }
}

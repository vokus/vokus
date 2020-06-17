import { Injectable } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware';
import { Request } from '../core/request';
import { Response } from '../core/response';
import cookieParser from 'cookie-parser';

@Injectable()
export class CookieParserMiddleware implements MiddlewareInterface {
    async handle(req: Request, res: Response, next: () => void): Promise<void> {
        return cookieParser()(req, res, next);
    }
}

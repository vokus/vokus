import { MiddlewareDecorator } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware.interface';
import { Request } from '../core/request';
import { Response } from '../core/response';
import cookieParser from 'cookie-parser';

@MiddlewareDecorator()
export class CookieParserMiddleware implements MiddlewareInterface {
    async handle(req: Request, res: Response, next: () => void): Promise<void> {
        return cookieParser()(req, res, next);
    }
}

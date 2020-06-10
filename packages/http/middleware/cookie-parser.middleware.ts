import { MiddlewareDecorator } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware.interface';
import cookieParser from 'cookie-parser';

@MiddlewareDecorator()
export class CookieParserMiddleware implements MiddlewareInterface {
    protected _key = 'http/cookie-parser';
    protected _function: any;

    public get function(): any {
        return cookieParser();
    }

    public get key(): string {
        return this._key;
    }
}

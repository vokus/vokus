import { MiddlewareDecorator } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware.interface';
import cookieParser from 'cookie-parser';
import express from 'express';

@MiddlewareDecorator()
export class CookieParserMiddleware implements MiddlewareInterface {
    async handle(req: express.Request, res: express.Response, next: () => void): Promise<void> {
        return cookieParser()(req, res, next);
    }
}

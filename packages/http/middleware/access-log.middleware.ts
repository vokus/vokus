import { LoggerService } from '@vokus/logger';
import { MiddlewareDecorator } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware.interface';
import express from 'express';

@MiddlewareDecorator()
export class AccessLogMiddleware implements MiddlewareInterface {
    protected _logger: LoggerService;

    public constructor(logger: LoggerService) {
        this._logger = logger;
    }

    public async handle(req: express.Request, res: express.Response, next: () => void): Promise<void> {
        await this._logger.info(req.url);

        return next();
    }
}

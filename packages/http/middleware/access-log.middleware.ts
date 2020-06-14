import { Request, Response } from 'express';
import { LoggerService } from '@vokus/logger';
import { MiddlewareDecorator } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware.interface';

@MiddlewareDecorator()
export class AccessLogMiddleware implements MiddlewareInterface {
    protected _logger: LoggerService;

    constructor(logger: LoggerService) {
        this._logger = logger;
    }

    async handle(req: Request, res: Response, next: () => void): Promise<void> {
        await this._logger.info(req.url);

        return next();
    }
}

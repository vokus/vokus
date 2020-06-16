import { Request, Response } from 'express';
import { LoggerService } from '@vokus/logger';
import { Middleware } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware.interface';

@Middleware()
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

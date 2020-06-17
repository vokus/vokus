import { LoggerService } from '@vokus/logger';

import { Injectable } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware';
import { Request } from '../core/request';
import { Response } from '../core/response';

@Injectable()
export class AccessLoggerMiddleware implements MiddlewareInterface {
    protected _logger: LoggerService;

    constructor(logger: LoggerService) {
        this._logger = logger;
    }

    async handle(req: Request, res: Response, next: () => void): Promise<void> {
        await this._logger.info(req.url);

        return next();
    }
}

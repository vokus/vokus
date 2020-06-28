import { Injectable } from '@vokus/dependency-injection';
import { Logger } from '../component/logger';
import { MiddlewareInterface } from '../interface/middleware';
import { Request } from '../core/request';
import { Response } from '../core/response';

@Injectable()
export class AccessLoggerMiddleware implements MiddlewareInterface {
    protected _logger: Logger;

    constructor(logger: Logger) {
        this._logger = logger;
    }

    async handle(req: Request, res: Response, next: () => void): Promise<void> {
        await this._logger.info(req.url);

        return next();
    }
}

import { Injectable } from '@vokus/dependency-injection';
import { Logger } from '@vokus/logger';
import { Request } from '../core/request';
import { Response } from '../core/response';

@Injectable()
export class ErrorMiddleware {
    protected _logger: Logger;

    constructor(logger: Logger) {
        this._logger = logger;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(error: Error, req: Request, res: Response, next: () => void): Promise<void> {
        this._logger.error(req.url + ' ' + error);
        return res.status(500).render('status-500', { error: error });
    }
}

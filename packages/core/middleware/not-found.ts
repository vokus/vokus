import { Injectable } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware';
import { Request } from '../core/request';
import { Response } from '../core/response';

@Injectable()
export class NotFoundMiddleware implements MiddlewareInterface {
    async handle(req: Request, res: Response): Promise<void> {
        if (['application/json'].includes(String(req.headers['content-type']))) {
            res.status(404).json({
                status: 404,
            });
            return;
        }

        res.status(404);
        return res.render('status-404');
    }
}

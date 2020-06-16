import { Request } from '../core/request';
import { Response } from '../core/response';

export interface MiddlewareInterface {
    handle(req: Request, res: Response, next: () => void): void;
}

import { Request } from '../core/request';
import { Response } from '../core/response';

export interface ControllerInterface {
    handle(req: Request, res: Response, next: () => void): Promise<void>;
}

import { ControllerInterface } from '../interface/controller';
import { Injectable } from '@vokus/dependency-injection';
import { MiddlewareInterface } from '../interface/middleware';
import { Request } from '../core/request';
import { Response } from '../core/response';

@Injectable()
export class RouteMiddleware implements MiddlewareInterface {
    protected _controller: ControllerInterface;

    set controller(controller: ControllerInterface) {
        this._controller = controller;
    }

    async handle(req: Request, res: Response, next: (arg?: any) => void): Promise<void> {
        try {
            return await this._controller.handle(req, res, next);
        } catch (err) {
            return next(err);
        }
    }
}

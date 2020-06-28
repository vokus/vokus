import express, { Handler } from 'express';
import { Injectable } from '../decorator/injectable';
import { MiddlewareInterface } from '../interface/middleware';
import { Request } from '../core/request';
import { Response } from '../core/response';

@Injectable()
export class StaticMiddleware implements MiddlewareInterface {
    protected _static: Handler;
    protected _path = '';

    set path(path: string) {
        this._path = path;
        this._static = express.static(path, { maxAge: '1 year' });
    }

    get path(): string {
        return this._path;
    }

    async handle(req: Request, res: Response, next: (arg?: any) => void): Promise<void> {
        return this._static(req, res, next);
    }
}

import * as express from 'express';

export interface MiddlewareInterface {
    handle(req: express.Request, res: express.Response, next: () => void): void;
}

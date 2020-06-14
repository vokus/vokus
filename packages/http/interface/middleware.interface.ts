import { Request, Response } from 'express';

export interface MiddlewareInterface {
    handle(req: Request, res: Response, next: () => void): void;
}

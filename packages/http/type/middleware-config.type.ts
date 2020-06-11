import { MiddlewareInterface } from '../interface/middleware.interface';

export type MiddlewareConfigType = {
    after?: string;
    before?: string;
    middleware: MiddlewareInterface;
};

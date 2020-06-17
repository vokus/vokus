import { MiddlewareInterface } from '../interface/middleware';

export type MiddlewareConfigType = {
    after?: string;
    before?: string;
    middleware: MiddlewareInterface;
};

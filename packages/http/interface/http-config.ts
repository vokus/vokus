import { MiddlewareConfigInterface } from './middleware-config';
import { RouteConfigInterface } from './route-config';

export interface HttpConfigInterface {
    middlewares: MiddlewareConfigInterface[];
    publicPaths: string[];
    routes: RouteConfigInterface[];
}

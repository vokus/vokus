import { MiddlewareConfigInterface } from './middleware-config';
import { RouteConfigInterface } from './route-config';

export interface HTTPConfigInterface {
    routes?: RouteConfigInterface[];
    middlewares?: MiddlewareConfigInterface[];
}

import { MiddlewareConfigInterface } from './middleware-config';
import { RouteConfigInterface } from './route-config';

export interface HttpConfigInterface {
    port?: number;
    middlewares?: MiddlewareConfigInterface[];
    publicPath?: string;
    routes?: RouteConfigInterface[];
}

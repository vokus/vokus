import { MiddlewareConfigInterface, RouteConfigInterface } from '@vokus/http';

export interface ConfigInterface {
    http?: {
        routes?: RouteConfigInterface[];
        middlewares?: MiddlewareConfigInterface[];
    };
    view?: {
        paths: string[];
    };
}

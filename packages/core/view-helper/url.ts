import { HttpServer } from '../component/http-server';
import { Injectable } from '../decorator/injectable';
import { RouteConfigInterface } from '../interface/route-config';
import { ViewHelperInterface } from '../interface/view-helper';

@Injectable()
export class UrlViewHelper implements ViewHelperInterface {
    protected _server: HttpServer;

    constructor(server: HttpServer) {
        this._server = server;
    }

    render(routeKey: string, data: { [key: string]: any }): string {
        if (this._server.config.routes === undefined) {
            throw new Error(`no routes defined`);
        }

        let matchingRoute: RouteConfigInterface | undefined = undefined;

        for (const route of this._server.config.routes) {
            if ('undefined' !== typeof route.key) {
                matchingRoute = route;
            }
        }

        if ('undefined' === typeof matchingRoute) {
            throw new Error(`route with name ${routeKey} does not exists`);
        }

        return matchingRoute.path.replace(/(\/:\w+\??)/g, (m: any, c: any) => {
            c = c.replace(/[/:?]/g, '');
            return data[c] ? '/' + data[c] : '';
        });
    }
}

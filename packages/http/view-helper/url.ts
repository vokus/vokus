import { HttpServer } from '../component/http-server';
import { Injectable } from '@vokus/dependency-injection';
import { RouteConfigInterface } from '../interface/route-config';
import { ViewHelperInterface } from '@vokus/view/interface/view-helper';

@Injectable()
export class UrlViewHelper implements ViewHelperInterface {
    protected _server: HttpServer;

    constructor(server: HttpServer) {
        this._server = server;
    }

    render(routeKey: string, data: { [key: string]: any }): string {
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

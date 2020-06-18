import { CMSMiddlewares, CMSRoutes } from '@vokus/cms';
import { HTTPServer } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';

@Injectable()
export class Application {
    protected _httpServer: HTTPServer;

    constructor(httpServer: HTTPServer) {
        this._httpServer = httpServer;
    }

    async start() {
        await this._httpServer.addRouteConfiguration(CMSRoutes);
        await this._httpServer.addMiddlewareConfiguration(CMSMiddlewares);
        await this._httpServer.start();
    }

    async stop() {
        await this._httpServer.stop();
    }
}

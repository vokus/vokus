process.env.HTTP_SERVER_PORT = '3000';

import { CMSMiddlewares, CMSRoutes } from '@vokus/cms';
import { HTTPServer } from '@vokus/http';
import { ObjectManager } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const httpServer: HTTPServer = await ObjectManager.get(HTTPServer);

    await httpServer.addRouteConfiguration(CMSRoutes);
    await httpServer.addMiddlewareConfiguration(CMSMiddlewares);
    await httpServer.start();
})();

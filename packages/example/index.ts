import { CMSMiddlewares, CMSRoutes } from '@vokus/cms';
import { HTTPServer } from '@vokus/http';
import { ObjectManager } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const httpServer: HTTPServer = await ObjectManager.get(HTTPServer);

    // await http.registerRoutes(CMSRoutes);
    // await http.registerMiddlewares(CMSMiddlewares);
    await httpServer.start();
})();

import { CMSMiddlewares, CMSRoutes } from '@vokus/cms';
import { ContainerComponent } from '@vokus/dependency-injection';
import { HTTPServerService } from '@vokus/http';

(async (): Promise<void> => {
    const http: HTTPServerService = await ContainerComponent.create(HTTPServerService);

    // await http.registerRoutes(CMSRoutes);
    // await http.registerMiddlewares(CMSMiddlewares);
    await http.start();
})();

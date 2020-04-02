import { ContainerComponent } from '@vokus/dependency-injection';
import { HTTPServerService } from '@vokus/http-server';

(async (): Promise<void> => {
    const httpServerService: HTTPServerService = await ContainerComponent.create(HTTPServerService);

    await httpServerService.start();
})();

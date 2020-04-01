import { ContainerComponent } from '@vokus/dependency-injection';
import { HTTPServerService } from '@vokus/http-server';

(async (): Promise<void> => {
    const httpServerService = await ContainerComponent.create(HTTPServerService);

    httpServerService.start();
})();

import { ContainerComponent } from '@vokus/dependency-injection';
import { HTTPServerService } from '@vokus/http-server';

class Application {
    constructor(cmsService: CMSService, httpServerService: HTTPServerService) {
        cmsService.start();
        httpServerService.start();
    }
}

(async (): Promise<void> => {
    await ContainerComponent.create(Application);
})();

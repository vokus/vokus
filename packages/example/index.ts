import { CMSService } from '@vokus/cms';
import { ContainerComponent } from '@vokus/dependency-injection';
import { HTTPServerService } from '@vokus/http';

class Application {
    protected _cmsService: CMSService;
    protected _httpServerService: HTTPServerService;

    constructor(cmsService: CMSService, httpServerService: HTTPServerService) {
        this._cmsService = cmsService;
        this._httpServerService = httpServerService;
    }

    async start() {
        await this._cmsService.start();
        await this._httpServerService.start();
    }
}

(async (): Promise<void> => {
    const app: Application = await ContainerComponent.create(Application);
    await app.start();
})();

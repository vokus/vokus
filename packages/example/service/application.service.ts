import { CMSService } from '@vokus/cms';
import { HTTPServerService } from '@vokus/http';
import { Service } from '@vokus/dependency-injection';

@Service()
export class ApplicationService {
    protected _cmsService: CMSService;
    protected _httpServerService: HTTPServerService;

    constructor(cmsService: CMSService, httpServerService: HTTPServerService) {
        this._cmsService = cmsService;
        this._httpServerService = httpServerService;
    }

    async start(): Promise<void> {
        await this._cmsService.start();
        await this._httpServerService.start();
    }

    async stop(): Promise<void> {
        await this._httpServerService.stop();
    }
}

import { CMSMiddlewareConfiguration, CMSRouteConfiguration, CMSTemplateConfiguration } from '@vokus/cms';
import { HTTPServer } from '@vokus/http';
import { Injectable } from '@vokus/dependency-injection';
import { Template } from '../cms/node_modules/@vokus/template';

@Injectable()
export class Application {
    protected _httpServer: HTTPServer;
    protected _template: Template;

    constructor(httpServer: HTTPServer, template: Template) {
        this._httpServer = httpServer;
        this._template = template;
    }

    async start() {
        await this._template.addTemplateConfiguration(CMSTemplateConfiguration);
        await this._template.start();

        await this._httpServer.addRouteConfiguration(CMSRouteConfiguration);
        await this._httpServer.addMiddlewareConfiguration(CMSMiddlewareConfiguration);
        await this._httpServer.start();
    }

    async stop() {
        await this._httpServer.stop();
    }
}

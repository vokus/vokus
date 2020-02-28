import cluster from 'cluster';
import os from 'os';
import ModuleDecorator from './decorator/module.decorator';
import HTTPServerService from './service/http-server.service';
import ModuleInterface from './interface/module.interface';
import IndexController from './controller/index.controller';
import ApplicationConfig from './config/application.config';

@ModuleDecorator({
    controllers: [IndexController],
})
export default class CoreModule implements ModuleInterface {
    protected applicationConfig: ApplicationConfig;
    protected httpServer: HTTPServerService;

    constructor(applicationConfig: ApplicationConfig, httpServer: HTTPServerService) {
        this.applicationConfig = applicationConfig;
        this.httpServer = httpServer;
    }

    public async start(): Promise<boolean> {
        /*
        if (cluster.isMaster && this.applicationConfig.cluster) {
            for (const cpu of os.cpus()) {
                cluster.fork();
            }
            return true;
        }*/

        return await this.httpServer.start();
    }

    public async stop(): Promise<boolean> {
        return await this.httpServer.stop();
    }
}

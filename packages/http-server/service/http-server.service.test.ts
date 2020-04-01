import { HTTPServerService } from '../';
import { ContainerComponent } from '@vokus/dependency-injection';

test('http-server', async () => {
    const httpServerService: HTTPServerService = await ContainerComponent.create(HTTPServerService);

    await httpServerService.start();

    await httpServerService.stop();
});

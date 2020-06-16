process.env.HTTP_SERVER_PORT = '3000';

import { AccessLogMiddleware } from './access-log.middleware';
import { Container } from '@vokus/dependency-injection';
import { HTTPClientComponent } from '../component/http-client.component';
import { HTTPServerService } from '../';

test('access-log', async () => {
    const httpServerService: HTTPServerService = await Container.create(HTTPServerService);
    const accessLogMiddleware: AccessLogMiddleware = await Container.create(AccessLogMiddleware);

    await httpServerService.registerMiddleware(accessLogMiddleware);

    await httpServerService.start();

    const httpClient = new HTTPClientComponent({
        rejectUnauthorized: false,
    });

    const response = await httpClient.get('https://localhost:3000/');

    expect(response.statusCode).toBe(404);

    await httpServerService.stop();
});

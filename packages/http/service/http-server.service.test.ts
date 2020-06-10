process.env.HTTP_SERVER_PORT = '3000';

import { ContainerComponent } from '@vokus/dependency-injection';
import { HTTPClientComponent } from '../component/http-client.component';
import { HTTPServerService } from '../';

test('http-server', async () => {
    const httpServerService: HTTPServerService = await ContainerComponent.create(HTTPServerService);

    await httpServerService.start();

    let httpClient = new HTTPClientComponent({
        rejectUnauthorized: false,
    });

    let response = await httpClient.get('https://localhost:3000/');

    expect(response.statusCode).toBe(404);

    httpClient = new HTTPClientComponent();

    try {
        response = await httpClient.get('https://localhost:3000/');
    } catch (e) {
        expect(e.message).toBe('self signed certificate');
    }

    expect(httpServerService.selfSigned).toBe(true);

    await httpServerService.stop();
});

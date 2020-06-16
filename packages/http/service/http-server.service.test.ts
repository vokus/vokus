process.env.HTTP_SERVER_PORT = '3000';

import { AccessLogMiddleware } from '../middleware/access-log.middleware';
import { Container } from '@vokus/dependency-injection';
import { EnvironmentComponent } from '@vokus/environment';
import { FileSystemComponent } from '../../logger/node_modules/@vokus/file-system';
import { HTTPClientComponent } from '../component/http-client.component';
import { HTTPServerService } from '../';
import path from 'path';

beforeAll(async () => {
    await FileSystemComponent.remove(EnvironmentComponent.configPath);
});

afterAll(async () => {
    await FileSystemComponent.remove(EnvironmentComponent.configPath);
});

test('http-server', async () => {
    const httpServerService: HTTPServerService = await Container.create(HTTPServerService);

    const accessLogMiddleware: AccessLogMiddleware = await Container.create(AccessLogMiddleware);

    expect(httpServerService.middlewares.length).toBe(0);

    await httpServerService.registerMiddleware(accessLogMiddleware);

    expect(httpServerService.listening).toBe(false);

    await httpServerService.start();

    expect(httpServerService.listening).toBe(true);

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

    expect(httpServerService.listening).toBe(false);

    expect(httpServerService.middlewares.length).toBe(1);

    await FileSystemComponent.copyFile(
        path.join(__dirname, '../self-signed-key.pem'),
        path.join(EnvironmentComponent.configPath, 'http-server', 'key.pem'),
    );
    await FileSystemComponent.copyFile(
        path.join(__dirname, '../self-signed-cert.pem'),
        path.join(EnvironmentComponent.configPath, 'http-server', 'cert.pem'),
    );

    await httpServerService.start();

    httpClient = new HTTPClientComponent({
        rejectUnauthorized: false,
    });

    response = await httpClient.get('https://localhost:3000/');

    expect(response.statusCode).toBe(404);

    await httpServerService.stop();
});

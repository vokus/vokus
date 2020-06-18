process.env.HTTP_SERVER_PORT = '3000';

import { AccessLoggerMiddleware } from '../middleware/access-logger';
import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/logger/node_modules/@vokus/file-system';
import { HTTPClient } from './http-client';
import { HTTPServer } from '..';
import { ObjectManager } from '@vokus/dependency-injection';
import path from 'path';

beforeAll(async () => {
    await FileSystem.remove(Environment.configPath);
});

afterAll(async () => {
    await FileSystem.remove(Environment.configPath);
});

test('http-server', async () => {
    const httpServerService: HTTPServer = await ObjectManager.get(HTTPServer);

    const accessLoggerMiddleware: AccessLoggerMiddleware = await ObjectManager.get(AccessLoggerMiddleware);

    expect(httpServerService.middlewares.length).toBe(0);

    await httpServerService.registerMiddleware(accessLoggerMiddleware);

    expect(httpServerService.listening).toBe(false);

    await httpServerService.start();

    expect(httpServerService.listening).toBe(true);

    let httpClient = new HTTPClient({
        rejectUnauthorized: false,
    });

    let response = await httpClient.get('https://localhost:3000/');

    expect(response.statusCode).toBe(404);

    httpClient = new HTTPClient();

    try {
        response = await httpClient.get('https://localhost:3000/');
    } catch (e) {
        expect(e.message).toBe('self signed certificate');
    }

    expect(httpServerService.selfSigned).toBe(true);

    await httpServerService.stop();

    expect(httpServerService.listening).toBe(false);

    expect(httpServerService.middlewares.length).toBe(1);

    await FileSystem.copyFile(
        path.join(__dirname, '../self-signed-key.pem'),
        path.join(Environment.configPath, 'http-server', 'key.pem'),
    );
    await FileSystem.copyFile(
        path.join(__dirname, '../self-signed-cert.pem'),
        path.join(Environment.configPath, 'http-server', 'cert.pem'),
    );

    await httpServerService.start();

    httpClient = new HTTPClient({
        rejectUnauthorized: false,
    });

    response = await httpClient.get('https://localhost:3000/');

    expect(response.statusCode).toBe(404);

    await httpServerService.stop();
});

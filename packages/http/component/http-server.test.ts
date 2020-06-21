process.env.HTTP_SERVER_PORT = '3000';

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
    const httpServer: HTTPServer = await ObjectManager.get(HTTPServer);

    expect(httpServer.listening).toBe(false);

    await httpServer.start();

    expect(httpServer.listening).toBe(true);

    const httpClient: HTTPClient = await ObjectManager.get(HTTPClient);

    expect((await httpClient.get('https://localhost:3000/')).statusCode).toBe(404);
    expect(httpServer.selfSigned).toBe(true);

    await httpServer.stop();

    expect(httpServer.listening).toBe(false);

    await FileSystem.copyFile(
        path.join(__dirname, '../self-signed-key.pem'),
        path.join(Environment.configPath, 'http-server', 'key.pem'),
    );
    await FileSystem.copyFile(
        path.join(__dirname, '../self-signed-cert.pem'),
        path.join(Environment.configPath, 'http-server', 'cert.pem'),
    );

    await httpServer.start();

    expect((await httpClient.get('https://localhost:3000/')).statusCode).toBe(404);

    await httpServer.stop();
});

import { Environment } from '@vokus/environment';
import { FileSystem } from '@vokus/file-system';
import { HttpClient } from './http-client';
import { HttpServer } from './http-server';
import { ObjectManager } from '@vokus/dependency-injection';
import path from 'path';

beforeAll(async () => {
    await FileSystem.remove(Environment.configPath);
});

afterAll(async () => {
    await FileSystem.remove(Environment.configPath);
});

test('http-server', async () => {
    const httpServer: HttpServer = await ObjectManager.get(HttpServer);

    expect(httpServer.listening).toBe(false);

    await httpServer.start();

    expect(httpServer.listening).toBe(true);

    const httpClient: HttpClient = await ObjectManager.get(HttpClient);

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

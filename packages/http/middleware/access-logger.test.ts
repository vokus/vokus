process.env.HTTP_SERVER_PORT = '3000';

import { AccessLoggerMiddleware } from './access-logger';
import { HTTPClient } from '../component/http-client';
import { HTTPServer } from '../component/http-server';
import { ObjectManager } from '@vokus/dependency-injection';

test('access-log', async () => {
    const httpServerService: HTTPServer = await ObjectManager.get(HTTPServer);
    const accessLogMiddleware: AccessLoggerMiddleware = await ObjectManager.get(AccessLoggerMiddleware);

    await httpServerService.registerMiddleware(accessLogMiddleware);

    await httpServerService.start();

    const httpClient = new HTTPClient({
        rejectUnauthorized: false,
    });

    const response = await httpClient.get('https://localhost:3000/');

    expect(response.statusCode).toBe(404);

    await httpServerService.stop();
});

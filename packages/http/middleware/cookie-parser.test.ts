process.env.HTTP_SERVER_PORT = '3000';

import { CookieParserMiddleware } from './cookie-parser';
import { HTTPClient } from '../component/http-client';
import { HTTPServer } from '..';
import { ObjectManager } from '@vokus/dependency-injection';

test('access-log', async () => {
    const httpServer: HTTPServer = await ObjectManager.get(HTTPServer);
    const cookieParserMiddleware: CookieParserMiddleware = await ObjectManager.get(CookieParserMiddleware);

    await httpServer.registerMiddleware(cookieParserMiddleware);

    await httpServer.start();

    const httpClient = new HTTPClient({
        rejectUnauthorized: false,
    });

    const response = await httpClient.get('https://localhost:3000/');

    expect(response.statusCode).toBe(404);

    await httpServer.stop();
});

process.env.HTTP_SERVER_PORT = '3000';

import { Application } from './application';
import { CoreConfig } from '../config/core-config';
import { HttpClient } from '@vokus/http';
import { ObjectManager } from '@vokus/dependency-injection';

test('http-server', async () => {
    const app: Application = await ObjectManager.get(Application);
    await app.addConfig(CoreConfig);
    await app.start();

    const httpClient: HttpClient = await ObjectManager.get(HttpClient);

    expect((await httpClient.get('https://localhost:3000/')).statusCode).toBe(404);
    expect((await httpClient.get('https://localhost:3000/user/sign-in')).statusCode).toBe(200);

    await app.stop();
});

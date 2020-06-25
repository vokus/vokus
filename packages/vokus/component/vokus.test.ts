process.env.HTTP_SERVER_PORT = '3000';

import { HttpClient } from '@vokus/http';
import { ObjectManager } from '@vokus/dependency-injection';
import { Vokus } from './vokus';
import { VokusConfig } from '../config/vokus-config';

test('http-server', async () => {
    const app: Vokus = await ObjectManager.get(Vokus);
    await app.addConfig(VokusConfig);
    await app.start();

    const httpClient: HttpClient = await ObjectManager.get(HttpClient);

    expect((await httpClient.get('https://localhost:3000/')).statusCode).toBe(404);
    expect((await httpClient.get('https://localhost:3000/vokus/user/sign-in')).statusCode).toBe(200);

    await app.stop();
});

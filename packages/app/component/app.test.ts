import { HttpClient, ObjectManager } from '@vokus/core';
import { App } from './app';
import { AppConfig } from '../config/app';

test('app', async () => {
    const app: App = await ObjectManager.get(App);

    await app.addConfig(AppConfig);
    await app.start();

    const httpClient: HttpClient = await ObjectManager.get(HttpClient);

    expect((await httpClient.get('https://localhost:3000/')).statusCode).toBe(404);
    expect((await httpClient.get('https://localhost:3000/vokus/user/sign-in')).statusCode).toBe(200);

    await app.stop();
});

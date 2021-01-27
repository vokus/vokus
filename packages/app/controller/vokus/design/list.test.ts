import { HttpClient, ObjectManager } from '@vokus/core';
import { App } from '../../../component/app';
import { AppConfig } from '../../../config/app';

test('list', async () => {
    const app: App = await ObjectManager.get(App);

    await app.addConfig(AppConfig);

    await app.start();

    const httpClient: HttpClient = await ObjectManager.get(HttpClient);

    // TODO: optimize
    expect((await httpClient.get('https://localhost:3000/vokus/design/list')).statusCode).toBe(200);

    await app.stop();
});

import { HttpClient, ObjectManager } from '@vokus/core';
import { Cms } from './cms';
import { CmsConfig } from '../config/cms';

test('cms', async () => {
    const cms: Cms = await ObjectManager.get(Cms);

    await cms.addConfig(CmsConfig);
    await cms.start();

    const httpClient: HttpClient = await ObjectManager.get(HttpClient);

    expect((await httpClient.get('https://localhost:3000/')).statusCode).toBe(404);
    expect((await httpClient.get('https://localhost:3000/vokus/user/sign-in')).statusCode).toBe(200);

    await cms.stop();
});

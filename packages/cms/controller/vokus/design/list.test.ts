import { HttpClient, ObjectManager } from '@vokus/core';
import { Cms } from '../../../component/cms';
import { CmsConfig } from '../../../config/cms';

test('list', async () => {
    const cms: Cms = await ObjectManager.get(Cms);

    await cms.addConfig(CmsConfig);

    await cms.start();

    const httpClient: HttpClient = await ObjectManager.get(HttpClient);

    // TODO: optimize
    expect((await httpClient.get('https://localhost:3000/vokus/design/list')).statusCode).toBe(404);

    await cms.stop();
});

import { Cms, CmsConfig } from '../../../index';
// import { HttpClient } from '@vokus/http';
import { ObjectManager } from '@vokus/dependency-injection';

test('list', async () => {
    const cms: Cms = await ObjectManager.get(Cms);
    await cms.start();
    await cms.addConfig(CmsConfig);

    // const httpClient: HttpClient = await ObjectManager.get(HttpClient);

    // expect((await httpClient.get('https://localhost:3000/vokus/design/list')).statusCode).toBe(200);

    await cms.stop();
});

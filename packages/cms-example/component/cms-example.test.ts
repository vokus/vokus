import { CmsExample } from './cms-example';
import { ObjectManager } from '@vokus/dependency-injection';

test('cms', async () => {
    const cmsExample: CmsExample = await ObjectManager.get(CmsExample);
    await cmsExample.start();
    await cmsExample.stop();
});

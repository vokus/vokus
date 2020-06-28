import { CmsExample } from './cms-example';
import { ObjectManager } from '@vokus/core';

test('cms', async () => {
    const cmsExample: CmsExample = await ObjectManager.get(CmsExample);
    await cmsExample.start();
    await cmsExample.stop();
});

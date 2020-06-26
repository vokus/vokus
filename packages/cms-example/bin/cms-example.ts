import { CmsExample } from '../component/cms-example';
import { ObjectManager } from '@vokus/dependency-injection';

(async () => {
    const cmsExample: CmsExample = await ObjectManager.get(CmsExample);
    await cmsExample.start();
})();

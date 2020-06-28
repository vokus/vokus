#!/usr/bin/env node

import { CmsExample } from '../component/cms-example';
import { ObjectManager } from '@vokus/core';

(async () => {
    const cmsExample: CmsExample = await ObjectManager.get(CmsExample);
    await cmsExample.start();
})();

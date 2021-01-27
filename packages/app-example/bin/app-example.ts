#!/usr/bin/env node

import { AppExample } from '../component/app-example';
import { ObjectManager } from '@vokus/core';

(async () => {
    const appExample: AppExample = await ObjectManager.get(AppExample);
    await appExample.start();
})();

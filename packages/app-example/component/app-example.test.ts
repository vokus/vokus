import { AppExample } from './app-example';
import { ObjectManager } from '@vokus/core';

test('app', async () => {
    const appExample: AppExample = await ObjectManager.get(AppExample);
    await appExample.start();
    await appExample.stop();
});

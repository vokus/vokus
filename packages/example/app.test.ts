process.env.HTTP_SERVER_PORT = '3000';

import { Application } from './app';
import { ObjectManager } from '@vokus/dependency-injection';

test('app', async () => {
    const app: Application = await ObjectManager.get(Application);

    await app.start();
    await app.stop();
});

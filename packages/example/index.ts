process.env.HTTP_SERVER_PORT = '3000';

import { Application } from '@vokus/app';
import { ObjectManager } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const app: Application = await ObjectManager.get(Application);
    await app.start();
})();

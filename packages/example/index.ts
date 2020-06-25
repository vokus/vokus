process.env.HTTP_SERVER_PORT = '3000';

import { Application, CoreConfig } from '@vokus/core';
import { ObjectManager } from '@vokus/dependency-injection';
import { UIConfig } from '@vokus/ui';

(async (): Promise<void> => {
    const app: Application = await ObjectManager.get(Application);
    await app.addConfig(CoreConfig);
    await app.addConfig(UIConfig);
    await app.start();
})();

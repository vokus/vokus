process.env.HTTP_SERVER_PORT = '3000';

import { CoreConfig, Application } from '@vokus/core';
import { UIConfig } from '@vokus/ui';
import { ObjectManager } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const app: Application = await ObjectManager.get(Application);
    await app.addConfig(Config);
    await app.addConfig(AppUiConfig);
    await app.start();
})();

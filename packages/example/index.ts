process.env.HTTP_SERVER_PORT = '3000';

import { Application, Config } from '@vokus/app';
import { Config as AppUiConfig } from '@vokus/app-ui';
import { ObjectManager } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const app: Application = await ObjectManager.get(Application);
    await app.addConfig(Config);
    await app.addConfig(AppUiConfig);
    await app.start();
})();

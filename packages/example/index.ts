import { Application } from './app';
import { ObjectManager } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const app: Application = await ObjectManager.get(Application);
    app.start();
})();

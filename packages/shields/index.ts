import { ObjectManager } from '@vokus/dependency-injection';
import { Shields } from './component/shields';

(async () => {
    const shields: Shields = await ObjectManager.get(Shields);
    await shields.start();
})();

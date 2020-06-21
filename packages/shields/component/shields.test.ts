import { ObjectManager } from '@vokus/dependency-injection';
import { Shields } from './shields';

test('shields', async () => {
    const shields: Shields = await ObjectManager.get(Shields);
    await shields.start();
});

import { Database } from './database';
import { ObjectManager } from '@vokus/dependency-injection';

test('database', async () => {
    const database: Database = await ObjectManager.get(Database);

    await database.start();
    await database.stop();
});

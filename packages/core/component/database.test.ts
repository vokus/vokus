import { Database } from './database';
import { ObjectManager } from './object-manager';

test('database', async () => {
    const database: Database = await ObjectManager.get(Database);

    await database.start();
    await database.stop();
});

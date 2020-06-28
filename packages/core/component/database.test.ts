import { Database } from './database';
import { LogRepository } from '../repository/log';
import { ObjectManager } from './object-manager';

test('database', async () => {
    const database: Database = await ObjectManager.get(Database);

    await database.start();
    await database.stop();

    // test with sqlite memory
    await database.addConfig({
        database: ':memory:',
        type: 'sqlite',
    });

    await database.start();
    expect(await database.drop()).toBe(true);
    await database.stop();
    expect(await database.drop()).toBe(false);

    // test with mysql
    await database.addConfig({
        database: 'test',
        type: 'mysql',
    });

    await database.start();
    await database.stop();

    const logRepository = await database.getRepository(LogRepository);

    expect(logRepository).toBe(undefined);
});

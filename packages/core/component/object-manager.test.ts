import { Injectable } from '../decorator/injectable';
import { ObjectManager } from './object-manager';

@Injectable()
class Test1Config {}

@Injectable()
class Test2Config extends Test1Config {}

@Injectable()
class Test3Config extends Test1Config {}

@Injectable()
class Test1Route {
    test1Config: Test1Config;

    constructor(test1Config: Test1Config) {
        this.test1Config = test1Config;
    }
}

@Injectable()
class Test2Route extends Test1Route {}

@Injectable()
class TestLogger {
    async emergency(message: string): Promise<void> {
        message;
    }

    async alert(message: string): Promise<void> {
        message;
    }

    async critical(message: string): Promise<void> {
        message;
    }

    async error(message: string): Promise<void> {
        message;
    }

    async warning(message: string): Promise<void> {
        message;
    }

    async notice(message: string): Promise<void> {
        message;
    }

    async info(message: string): Promise<void> {
        message;
    }

    async debug(message: string): Promise<void> {
        message;
    }
}

@Injectable()
class Database1 {
    getRepository() {
        return null;
    }
}

@Injectable()
class Database2 extends Database1 {
    getRepository() {
        return null;
    }
}

@Injectable()
class Test1Component {}

@Injectable()
class Test2Compoennt extends Test1Component {}

@Injectable()
class Test3Component extends Test2Compoennt {}

@Injectable()
class Test4Component {
    test1Config: Test1Config;
    test2Config: Test2Config;
    test1Route: Test1Route;
    test1Component: Test1Component;
    testLogger: TestLogger;

    constructor(
        test1Config: Test1Config,
        test2Config: Test2Config,
        test1Route: Test1Route,
        test1Component: Test1Component,
        testLogger: TestLogger,
    ) {
        this.test1Config = test1Config;
        this.test2Config = test2Config;
        this.test1Route = test1Route;
        this.test1Component = test1Component;
        this.testLogger = testLogger;
    }
}

class Test5Component {}

test('container', async () => {
    let error: Error = new Error();

    ObjectManager.register(Test4Component);

    try {
        await ObjectManager.get(Test5Component);
    } catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error('class "Test5Component" is not registered'));

    const test3Component: Test3Component = await ObjectManager.get(Test3Component);

    expect(typeof test3Component).toBe('object');

    const test4Component: Test4Component = await ObjectManager.get(Test4Component);

    expect(() => {
        ObjectManager.register(Test4Component);
    }).toThrowError('register() not allowed after create() call');

    expect(test4Component.test1Config instanceof Test1Config).toBe(true);
    expect(test4Component.test2Config instanceof Test2Config).toBe(true);
    expect(test4Component.test1Config instanceof Test3Config).toBe(true);

    expect(test4Component.test1Route instanceof Test1Route).toBe(true);
    expect(test4Component.test1Route instanceof Test2Route).toBe(true);

    expect(test4Component.test1Component instanceof Test1Component).toBe(true);
    expect(test4Component.test1Component instanceof Test2Compoennt).toBe(true);
    expect(test4Component.test1Component instanceof Test3Component).toBe(true);

    expect(test4Component.test1Route.test1Config instanceof Test3Config).toBe(true);

    await ObjectManager.getDatabaseInstance();
    await ObjectManager.get(Database2);
    await ObjectManager.getDatabaseInstance();
});

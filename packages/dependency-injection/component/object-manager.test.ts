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
class TestLoggerService {
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
class Test1Service {}

@Injectable()
class Test2Service extends Test1Service {}

@Injectable()
class Test3Service extends Test2Service {}

@Injectable()
class Test4Service {
    test1Config: Test1Config;
    test2Config: Test2Config;
    test1Route: Test1Route;
    test1Service: Test1Service;
    testLogger: TestLoggerService;

    constructor(
        test1Config: Test1Config,
        test2Config: Test2Config,
        test1Route: Test1Route,
        test1Service: Test1Service,
        testLogger: TestLoggerService,
    ) {
        this.test1Config = test1Config;
        this.test2Config = test2Config;
        this.test1Route = test1Route;
        this.test1Service = test1Service;
        this.testLogger = testLogger;
    }
}

class Test5Service {}

test('container', async () => {
    let error: Error = new Error();

    ObjectManager.register(Test4Service);

    try {
        await ObjectManager.get(Test5Service);
    } catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error('class "Test5Service" is not registered'));

    const test3Service: Test3Service = await ObjectManager.get(Test3Service);

    expect(typeof test3Service).toBe('object');

    const test4Service: Test4Service = await ObjectManager.get(Test4Service);

    expect(() => {
        ObjectManager.register(Test4Service);
    }).toThrowError('register() not allowed after create() call');

    expect(test4Service.test1Config instanceof Test1Config).toBe(true);
    expect(test4Service.test2Config instanceof Test2Config).toBe(true);
    expect(test4Service.test1Config instanceof Test3Config).toBe(true);

    expect(test4Service.test1Route instanceof Test1Route).toBe(true);
    expect(test4Service.test1Route instanceof Test2Route).toBe(true);

    expect(test4Service.test1Service instanceof Test1Service).toBe(true);
    expect(test4Service.test1Service instanceof Test2Service).toBe(true);
    expect(test4Service.test1Service instanceof Test3Service).toBe(true);

    expect(test4Service.test1Route.test1Config instanceof Test3Config).toBe(true);
});

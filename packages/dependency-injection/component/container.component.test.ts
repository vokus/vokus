import { ConfigDecorator } from '../decorator/config.decorator';
import { ContainerComponent } from './container.component';
import { RouteDecorator } from '../decorator/route.decorator';
import { ServiceDecorator } from '../decorator/service.decorator';

@ConfigDecorator()
class Test1Config {}

@ConfigDecorator()
class Test2Config extends Test1Config {}

@ConfigDecorator()
class Test3Config extends Test1Config {}

@RouteDecorator()
class Test1Route {
    test1Config: Test1Config;

    constructor(test1Config: Test1Config) {
        this.test1Config = test1Config;
    }
}

@RouteDecorator()
class Test2Route extends Test1Route {}

@ServiceDecorator()
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

class TestException {}

@ServiceDecorator()
class Test1Service {}

@ServiceDecorator()
class Test2Service extends Test1Service {}

@ServiceDecorator()
class Test3Service extends Test2Service {}

@ServiceDecorator()
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

    try {
        ContainerComponent.register(TestException);
    } catch (e) {
        error = e;
    }

    ContainerComponent.register(Test4Service);

    expect(error).toEqual(new Error('can not register "TestException" - type "exception" not allowed'));

    try {
        await ContainerComponent.create(Test5Service);
    } catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error('class "Test5Service" is not registered'));

    const test3Service: Test3Service = await ContainerComponent.create(Test3Service);

    expect(typeof test3Service).toBe('object');

    const test4Service: Test4Service = await ContainerComponent.create(Test4Service);

    expect(() => {
        ContainerComponent.register(Test4Service);
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

import { ConfigDecorator } from '../decorator/config.decorator';
import { ControllerDecorator } from '../decorator/controller.decorator';
import { ServiceDecorator } from '../decorator/service.decorator';
import { ContainerComponent } from './container.component';
import { LoggerInterface } from '@vokus/core';

@ConfigDecorator()
class Test1Config {}

@ConfigDecorator()
class Test2Config extends Test1Config {}

@ConfigDecorator()
class Test3Config extends Test1Config {}

@ControllerDecorator()
class Test1Controller {
    public test1Config: Test1Config;

    constructor(test1Config: Test1Config) {
        this.test1Config = test1Config;
    }
}

@ControllerDecorator()
class Test2Controller extends Test1Controller {}

@ServiceDecorator()
class TestLoggerService implements LoggerInterface {
    public async emergency(message: string): Promise<void> {
        message;
    }

    public async alert(message: string): Promise<void> {
        message;
    }

    public async critical(message: string): Promise<void> {
        message;
    }

    public async error(message: string): Promise<void> {
        message;
    }

    public async warning(message: string): Promise<void> {
        message;
    }

    public async notice(message: string): Promise<void> {
        message;
    }

    public async info(message: string): Promise<void> {
        message;
    }

    public async debug(message: string): Promise<void> {
        message;
    }
}

@ServiceDecorator()
class Test1Service {}

@ServiceDecorator()
class Test2Service extends Test1Service {}

@ServiceDecorator()
class Test3Service extends Test2Service {}

@ServiceDecorator()
class Test4Service {
    public test1Config: Test1Config;
    public test2Config: Test2Config;
    public test1Controller: Test1Controller;
    public test1Service: Test1Service;
    public testLogger: TestLoggerService;

    constructor(
        test1Config: Test1Config,
        test2Config: Test2Config,
        test1Controller: Test1Controller,
        test1Service: Test1Service,
        testLogger: TestLoggerService,
    ) {
        this.test1Config = test1Config;
        this.test2Config = test2Config;
        this.test1Controller = test1Controller;
        this.test1Service = test1Service;
        this.testLogger = testLogger;
    }
}

class Test5Service {}

test('container', async () => {
    let error: Error = new Error();

    try {
        await ContainerComponent.create(Test5Service);
    } catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error('class "Test5Service" is not registered'));

    const test4Service: Test4Service = await ContainerComponent.create(Test4Service);

    try {
        await ContainerComponent.create(Test4Service);
    } catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error('create() not allowed after create() call'));

    expect(() => {
        ContainerComponent.register(Test4Service, 'service');
    }).toThrowError('register() not allowed after create() call');

    expect(test4Service.test1Config instanceof Test1Config).toBe(true);
    expect(test4Service.test2Config instanceof Test2Config).toBe(true);
    expect(test4Service.test1Config instanceof Test3Config).toBe(true);

    expect(test4Service.test1Controller instanceof Test1Controller).toBe(true);
    expect(test4Service.test1Controller instanceof Test2Controller).toBe(true);

    expect(test4Service.test1Service instanceof Test1Service).toBe(true);
    expect(test4Service.test1Service instanceof Test2Service).toBe(true);
    expect(test4Service.test1Service instanceof Test3Service).toBe(true);

    expect(test4Service.test1Controller.test1Config instanceof Test3Config).toBe(true);

    expect(Object.values(ContainerComponent.classes).length).toBe(10);
});

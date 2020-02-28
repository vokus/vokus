/* tslint:disable:max-classes-per-file */

import ApplicationUtil from './application.util';
import CoreModule from '../core.module';
import ServiceDecorator from '../decorator/service.decorator';
import LoggerService from '../service/logger.service';

class TestServiceWithoutDecorator {}

@ServiceDecorator()
class Test1Service {}

@ServiceDecorator()
class Test2Service extends Test1Service {}

@ServiceDecorator()
class Test3Service extends Test2Service {}

@ServiceDecorator()
class TestLoggerService extends LoggerService {
    protected async log(code: number, message: string, data?: any): Promise<void> {
        const test = code + message;
    }
}

test('application', async () => {
    const core = await ApplicationUtil.create<CoreModule>(CoreModule);

    // test inheritence
    expect((await ApplicationUtil.create<Test2Service>(Test2Service)) instanceof Test3Service).toBe(true);

    // test not allowed registerClass after first create
    try {
        ApplicationUtil.registerClass(TestServiceWithoutDecorator, 'service');
    } catch (e) {
        expect(e.message).toBe('registerClass() not allowed after create() call');
    }

    // test create not registered class
    try {
        await ApplicationUtil.create<TestServiceWithoutDecorator>(TestServiceWithoutDecorator);
    } catch (e) {
        expect(e.message).toBe('class is not registered');
    }

    expect(Object.keys(ApplicationUtil.classes).length).toBeGreaterThan(0);
    expect(Object.keys(ApplicationUtil.instances).length).toBeGreaterThan(0);

    expect(await core.start()).toBe(true);
    expect(await core.stop()).toBe(true);
});

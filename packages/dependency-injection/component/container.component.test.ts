import { ServiceDecorator } from '../decorator/service.decorator';
import { ContainerComponent } from './container.component';

@ServiceDecorator()
class Test1Service { }

@ServiceDecorator()
class Test2Service extends Test1Service { }

@ServiceDecorator()
class Test3Service extends Test2Service { }

@ServiceDecorator()
class Test4Service {
    public test1Service: Test1Service;

    constructor(test1Service: Test1Service) {
        this.test1Service = test1Service;
    }
}

test('container', async () => {
    const test4Service: Test4Service = await ContainerComponent.create(Test4Service);

    expect(test4Service.test1Service instanceof Test3Service).toBe(true);
});

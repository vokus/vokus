import { CMSService } from '../index';
import { ContainerComponent } from '@vokus/dependency-injection';

describe('CMSService', () => {
    test('start', async () => {
        const cmsService: CMSService = await ContainerComponent.create(CMSService);

        await cmsService.start();
    });
});

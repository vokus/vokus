import { CMSService } from '../index';
import { Container } from '@vokus/dependency-injection';

describe('CMSService', () => {
    test('start', async () => {
        const cmsService: CMSService = await Container.create(CMSService);

        await cmsService.start();
    });
});

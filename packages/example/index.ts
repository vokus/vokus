import { ApplicationService } from './service/application.service';
import { Container } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const app: ApplicationService = await Container.create(ApplicationService);
    await app.start();
})();

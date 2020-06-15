import { ApplicationService } from './service/application.service';
import { ContainerComponent } from '@vokus/dependency-injection';

(async (): Promise<void> => {
    const app: ApplicationService = await ContainerComponent.create(ApplicationService);
    await app.start();
})();

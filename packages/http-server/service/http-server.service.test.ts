import * as https from 'https';
import { HTTPServerService } from '../';
import { ContainerComponent } from '@vokus/dependency-injection';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

test('https-server', async () => {
    const httpServerService: HTTPServerService = await ContainerComponent.create(HTTPServerService);

    await httpServerService.start();

    await new Promise((resolve, reject) => {
        https.get(
            'https://localhost:3000',
            {
                rejectUnauthorized: false,
            },
            res => {
                resolve();
            },
        );
    });

    await httpServerService.stop();
});

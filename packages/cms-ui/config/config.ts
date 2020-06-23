import { ConfigInterface } from '@vokus/cms/interface/config';
import { DesignController } from '../controller/vokus/design';
import path from 'path';

export const Config: ConfigInterface = {
    http: {
        routes: [
            {
                controller: DesignController,
                key: 'vokus/design',
                method: 'get',
                path: '/vokus/design',
            },
        ],
    },
    view: {
        paths: [path.join(__dirname, 'view/template')],
    },
};

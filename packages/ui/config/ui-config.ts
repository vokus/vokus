import { ConfigInterface } from '@vokus/vokus';
import { DesignController } from '../controller/vokus/design';
import path from 'path';

export const UIConfig: ConfigInterface = {
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
        helpers: [],
        paths: [path.join(__dirname, '../view/template')],
    },
};

import { ConfigInterface } from '@vokus/core';
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
        paths: [path.join(__dirname, '../view/template')],
    },
};

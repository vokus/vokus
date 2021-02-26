import { AppConfigInterface } from '@vokus/app';
import { AppExampleHomeController } from '../controller/home';
import path from 'path';

export const AppExampleConfig: AppConfigInterface = {
    asset: {
        paths: [
            {
                key: 'app-example',
                path: path.join(__dirname, '../asset'),
            },
        ],
    },
    http: {
        port: 3000,
        routes: [
            {
                controller: AppExampleHomeController,
                key: 'home',
                method: 'get',
                path: '/',
            },
        ],
    },
    view: {
        paths: [path.join(__dirname, '../view/template')],
    },
};

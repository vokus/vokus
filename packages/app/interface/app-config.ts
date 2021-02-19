import { HttpConfigInterface, ViewConfigInterface, WebpackConfigInterface } from '@vokus/core';
export interface AppConfigInterface {
    http?: HttpConfigInterface;
    view?: ViewConfigInterface;
    webpack?: WebpackConfigInterface;
}

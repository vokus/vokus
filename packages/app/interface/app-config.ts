import { AssetConfigInterface, HttpConfigInterface, ViewConfigInterface } from '@vokus/core';
export interface AppConfigInterface {
    asset?: AssetConfigInterface;
    http?: HttpConfigInterface;
    view?: ViewConfigInterface;
}

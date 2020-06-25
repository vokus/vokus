import { HttpConfigInterface, ViewConfigInterface } from '@vokus/http';

export interface ConfigInterface {
    http?: HttpConfigInterface;
    view?: ViewConfigInterface;
}

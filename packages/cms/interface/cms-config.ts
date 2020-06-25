import { HttpConfigInterface, ViewConfigInterface } from '@vokus/http';

export interface CmsConfigInterface {
    http?: HttpConfigInterface;
    view?: ViewConfigInterface;
}

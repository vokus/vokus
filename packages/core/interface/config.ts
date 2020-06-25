import { HttpConfigInterface } from '@vokus/http/interface/http-config';
import { ViewConfigInterface } from '@vokus/view';

export interface ConfigInterface {
    http?: HttpConfigInterface;
    view?: ViewConfigInterface;
}

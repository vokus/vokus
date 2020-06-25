import { HttpConfigInterface } from '@vokus/http/interface/http-config';
import { ViewConfigInterface } from '@vokus/http';

export interface ConfigInterface {
    http?: HttpConfigInterface;
    view?: ViewConfigInterface;
}

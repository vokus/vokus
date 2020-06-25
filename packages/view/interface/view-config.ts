import { ViewHelperConfigInterface } from './view-helper-config';

export interface ViewConfigInterface {
    paths: string[];
    helpers: ViewHelperConfigInterface[];
}

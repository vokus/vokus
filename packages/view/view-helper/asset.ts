import { Environment } from '@vokus/environment';
import { Injectable } from '@vokus/dependency-injection';
import { ViewHelperInterface } from '../interface/view-helper';
import path from 'path';

@Injectable()
export class AssetViewHelper implements ViewHelperInterface {
    render(src: string): string {
        return path.join('/assets/', src) + '?' + Environment.buildDate.getTime();
    }
}

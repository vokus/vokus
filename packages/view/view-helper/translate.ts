import { Injectable } from '@vokus/dependency-injection';
import { ViewHelperInterface } from '../interface/view-helper';

@Injectable()
export class TranslateViewHelper implements ViewHelperInterface {
    render(locale: string, key: string, data: { [key: string]: any }): string {
        return key;

        //return this.i18n.translate(locale, key, data);
    }
}

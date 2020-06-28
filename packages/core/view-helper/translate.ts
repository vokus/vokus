import { Injectable } from '../decorator/injectable';
import { ViewHelperInterface } from '../interface/view-helper';

@Injectable()
export class TranslateViewHelper implements ViewHelperInterface {
    render(locale: string, key: string): string {
        return key;
    }
    /*
    render(locale: string, key: string, data: { [key: string]: any }): string {
        return this.i18n.translate(locale, key, data);
    }*/
}

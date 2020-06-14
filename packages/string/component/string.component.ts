import { slugify } from 'transliteration';

export class StringComponent {
    static camelize(text: string): string {
        return text.replace(/^([A-Z])|[\s-_.]+(\w)/g, (match, p1, p2) => {
            if (p2) {
                return p2.toUpperCase();
            }
            return p1.toLowerCase();
        });
    }

    static decamelize(text: string, separator = '-'): string {
        return text
            .replace(/\s/g, '')
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .replace(/_/g, separator)
            .toLowerCase();
    }

    static slugify(text: string, separator = '-'): string {
        text = text.replace(/([a-z\d])([A-Z])/g, '$1 $2');

        return slugify(text, { separator: separator, allowedChars: 'a-zA-Z0-9' + separator });
    }
}

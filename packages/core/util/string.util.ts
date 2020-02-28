export default class StringUtil {
    public static camelize(text: string) {
        return text.replace(/^([A-Z])|[\s-_.]+(\w)/g, (match, p1, p2, offset) => {
            if (p2) {
                return p2.toUpperCase();
            }
            return p1.toLowerCase();
        });
    }

    public static decamelize(text: string, separator: string = '-') {
        return text
            .replace(/\s/g, '')
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .replace(/_/g, separator)
            .toLowerCase();
    }

    public static cast(data: any) {
        if (null === data) {
            return 'null';
        }

        if ('undefined' === typeof data) {
            return 'undefined';
        }

        if (data instanceof Error) {
            return String(data);
        }

        if ('object' === typeof data) {
            const cache: any[] = [];

            return JSON.stringify(data, (key, val) => {
                // prevent cycles
                if (typeof val === 'object') {
                    if (cache.indexOf(val) !== -1) {
                        return;
                    }
                    cache.push(val);
                }
                return val;
            });
        }

        return String(data);
    }
}

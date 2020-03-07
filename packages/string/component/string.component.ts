export class StringComponent {
    public static camelize(text: string): string {
        return text.replace(/^([A-Z])|[\s-_.]+(\w)/g, (match, p1, p2) => {
            if (p2) {
                return p2.toUpperCase();
            }
            return p1.toLowerCase();
        });
    }

    public static decamelize(text: string, separator = '-'): string {
        return text
            .replace(/\s/g, '')
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .replace(/_/g, separator)
            .toLowerCase();
    }
}

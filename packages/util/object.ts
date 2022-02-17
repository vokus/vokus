export class ObjectUtil {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async merge(target: any, source: any): Promise<any> {
        for (const key of Object.keys(source)) {
            if (Array.isArray(source[key]) && key in target) {
                source[key] = target[key].concat(source[key]);
            } else if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], await this.merge(target[key], source[key]));
            }
        }

        Object.assign(target, source);

        return target;
    }
}

import 'reflect-metadata';

export class ContainerComponent {
    public static register(target: any, type: 'config' | 'controller' | 'service'): void {
        if (this._created) {
            throw new Error('register() not allowed after create() call');
        }

        this._classes[Object.keys(this._classes).length] = {
            class: target,
            replaceBy: undefined,
            isLogger: false,
            type: type,
            instance: undefined,
        };
    }

    public static async create<T>(target: any): Promise<T> {
        if (this._created) {
            throw new Error('create() not allowed after create() call');
        }

        await this.enrichClasses();

        const instance = await this.createInstance(target, this.name, 'util');

        this._created = true;

        return instance;
    }

    public static get classes(): any {
        return this._classes;
    }

    private static _created = false;
    private static _classes: { [key: string]: any } = {};

    private static async createInstance(target: any, parentName: string, parentType: string): Promise<any> {
        let resolvedEntry: any = null;

        for (const entry of Object.values(this._classes)) {
            if (target === entry.class) {
                resolvedEntry = entry;

                if (undefined !== entry.replaceBy) {
                    resolvedEntry = this._classes[entry.replaceBy];
                }
                break;
            }
        }

        if (resolvedEntry === null) {
            throw new Error(`class "${target.name}" is not registered`);
        }

        if (undefined !== resolvedEntry.instance) {
            return resolvedEntry.instance;
        }

        const classParameters = Reflect.getMetadata('design:paramtypes', resolvedEntry.class) || [];

        const instancesToInject = [];

        let loggerParameters: string[] = [];

        if (resolvedEntry.isLogger) {
            loggerParameters = [parentType, parentName];
        }

        for (const classParameter of classParameters) {
            const instance =
                resolvedEntry.isLogger && classParameter === String
                    ? loggerParameters.shift()
                    : await this.createInstance(classParameter, resolvedEntry.class.name, resolvedEntry.type);

            instancesToInject.push(instance);
        }

        if (resolvedEntry.isLogger) {
            return new resolvedEntry.class(...instancesToInject);
        }

        resolvedEntry.instance = new resolvedEntry.class(...instancesToInject);

        return resolvedEntry.instance;
    }

    private static async enrichClasses(): Promise<void> {
        for (const entry of Object.values(this._classes)) {
            // test if class is logger
            if (
                'function' === typeof entry.class.emergency &&
                'function' === typeof entry.class.alert &&
                'function' === typeof entry.class.critical &&
                'function' === typeof entry.class.error &&
                'function' === typeof entry.class.warning &&
                'function' === typeof entry.class.notice &&
                'function' === typeof entry.class.info &&
                'function' === typeof entry.class.debug
            ) {
                entry.isLogger = true;
            }

            for (const [key, entryToCheck] of Object.entries(this._classes)) {
                if (entry.class.isPrototypeOf(entryToCheck.class)) {
                    entry.replaceBy = key;
                }
            }
        }
    }
}

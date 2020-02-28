import 'reflect-metadata';

export default class ApplicationUtil {
    public static registerClass(target: any, type: string) {
        if (this._created) {
            throw new Error('registerClass() not allowed after create() call');
        }

        if (undefined === this._classes[type]) {
            this._classes[type] = {};
            this._instances[type] = {};
        }

        this._classes[type][Object.keys(this._classes[type]).length] = target;
    }

    public static async create<T>(target: any): Promise<T> {
        // clean perviosly registered classes
        if (!this._created) {
            await this.cleanClasses();
            await this.detectLoggerClass();
            await this.createInstances();

            this._created = true;
        }

        return this.createInstance(target, this.name, 'util');
    }

    public static get classes(): any {
        return this._classes;
    }

    public static get instances(): any {
        return this._instances;
    }

    private static _created: boolean = false;
    private static _classes: { [key: string]: { [key: string]: any } } = {};
    private static _loggerClass: any;
    private static _instances: { [key: string]: { [key: string]: any } } = {};

    private static async createInstance(target: any, parentName: string, parentType: string): Promise<any> {
        let resolvedTarget: any = null;
        let resolvedType: string = '';
        let resolvedIndex: string = '';

        for (const [type, classes] of Object.entries(this._classes)) {
            if (null !== resolvedTarget) {
                break;
            }

            for (const [index, entry] of Object.entries(classes)) {
                if (target.isPrototypeOf(entry) || target === entry) {
                    resolvedIndex = index;
                    resolvedTarget = entry;
                    resolvedType = type;
                    break;
                }
            }
        }

        if (null === resolvedTarget) {
            throw new Error('class is not registered');
        }

        if (undefined !== this._instances[resolvedType] && undefined !== this._instances[resolvedType][resolvedIndex]) {
            return this._instances[resolvedType][resolvedIndex];
        }

        const instancesToInject = [];
        const classParameters = Reflect.getMetadata('design:paramtypes', resolvedTarget) || [];

        let isLogger = false;
        let loggerParameters: string[] = [];

        if (resolvedTarget.isPrototypeOf(this._loggerClass) || resolvedTarget === this._loggerClass) {
            isLogger = true;
            loggerParameters = [parentType, parentName];
        }

        for (const classParameter of classParameters) {
            let instance = null;

            if (isLogger && classParameter === String) {
                instance = loggerParameters.shift();
            } else {
                instance = await this.createInstance(classParameter, resolvedTarget.name, resolvedType);
            }

            instancesToInject.push(instance);
        }

        if (isLogger) {
            return new resolvedTarget(...instancesToInject);
        }

        return (this._instances[resolvedType][resolvedIndex] = new resolvedTarget(...instancesToInject));
    }

    private static async createInstances(): Promise<void> {
        for (const classes of Object.values(this._classes)) {
            for (const entry of Object.values(classes)) {
                if (entry === this._loggerClass) {
                    continue;
                }

                await this.createInstance(entry, this.name, 'util');
            }
        }
    }

    private static async detectLoggerClass(): Promise<void> {
        const LoggerService = (await import('../service/logger.service')).default;

        for (const entry of Object.values(this._classes.service)) {
            if (LoggerService.isPrototypeOf(entry) || entry === LoggerService) {
                this._loggerClass = entry;
                return;
            }
        }
    }

    private static async cleanClasses(): Promise<void> {
        for (const classes of Object.values(this._classes)) {
            for (const entry of Object.values(classes)) {
                if (await this.removePrototype(entry)) {
                    await this.cleanClasses();
                    return;
                }
            }
        }
    }

    private static async removePrototype(classToTest: any): Promise<boolean> {
        for (const [type, classes] of Object.entries(this._classes)) {
            for (const [index, entry] of Object.entries(classes)) {
                if (entry.isPrototypeOf(classToTest)) {
                    delete this._classes[type][index];
                    return true;
                }
            }
        }
        return false;
    }
}

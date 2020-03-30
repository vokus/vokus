import 'reflect-metadata';
import { MetaInterface } from '@vokus/core';
import { StringComponent } from '@vokus/string';
export class ContainerComponent {
    protected static _created = false;
    protected static _metaData: MetaInterface[] = [];

    public static register(constructor: any): void {
        if (this._created) {
            throw new Error('register() not allowed after create() call');
        }

        this._metaData.push({
            constructor: constructor,
            name: constructor.name,
            key: StringComponent.decamelize(constructor.name),
            type: StringComponent.decamelize(constructor.name.split(/(?=[A-Z][^A-Z]+$)/).pop()),
            replacedBy: undefined,
            instance: undefined,
            instantiatedBy: undefined,
        });
    }

    public static async create<T>(constructor: any): Promise<T> {
        if (this._created) {
            throw new Error('create() not allowed after create() call');
        }

        let meta: MetaInterface | undefined = undefined;

        for (const entry of this._metaData) {
            if (constructor === entry.constructor) {
                meta = entry;
                break;
            }
        }

        if (meta === undefined) {
            throw new Error(`class "${constructor.name}" is not registered`);
        }

        await this.enrichMetaData();

        const instance = await this.createInstance(meta);

        this._created = true;

        return instance;
    }

    public static get metaData(): any {
        return this._metaData;
    }

    protected static async createInstance(meta: MetaInterface): Promise<any> {
        if (meta.replacedBy !== undefined) {
            meta = meta.replacedBy;
        }

        if (undefined !== meta.instance) {
            return meta.instance;
        }

        const classParameters = Reflect.getMetadata('design:paramtypes', meta.constructor) || [];

        const instancesToInject = [];

        for (const classParameter of classParameters) {
            const meta = await this.getMetaByConstructor(classParameter);

            if (meta === undefined) {
                throw new Error(`class "${classParameter.name}" is not registered`);
            }

            instancesToInject.push(await this.createInstance(meta));
        }

        meta.instance = new meta.constructor(...instancesToInject);
        meta.instance.__meta = meta;

        return meta.instance;
    }

    protected static async getMetaByConstructor(constructor: any): Promise<MetaInterface | undefined> {
        for (const meta of this._metaData) {
            if (constructor === meta.constructor) {
                return meta;
            }
        }

        return undefined;
    }

    protected static async enrichMetaData(): Promise<void> {
        for (const meta of this._metaData) {
            for (const metaToCheck of this._metaData) {
                if (meta.constructor.isPrototypeOf(metaToCheck.constructor)) {
                    meta.replacedBy = metaToCheck;
                }
            }
        }
    }
}

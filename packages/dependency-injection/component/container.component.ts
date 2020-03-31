import 'reflect-metadata';
import { MetaInterface } from '@vokus/core';
import { StringComponent } from '@vokus/string';
export class ContainerComponent {
    protected static _created = false;
    protected static _metaData: MetaInterface[] = [];

    public static register(Function: any): void {
        if (this._created) {
            throw new Error('register() not allowed after create() call');
        }

        this._metaData.push({
            function: Function,
            name: Function.name,
            key: StringComponent.decamelize(Function.name),
            type: StringComponent.decamelize(Function.name.split(/(?=[A-Z][^A-Z]+$)/).pop()),
            replacedBy: undefined,
            instance: undefined,
            instantiatedBy: undefined,
        });
    }

    public static async create<T>(Function: any): Promise<T> {
        if (this._created) {
            throw new Error('create() not allowed after create() call');
        }

        this.register(ContainerComponent);

        const instantiateByMeta = await this.getMetaByFunction(ContainerComponent);
        const meta = await this.getMetaByFunction(Function);

        await this.enrichMetaData();

        const instance = await this.createInstance(meta, instantiateByMeta);

        this._created = true;

        return instance;
    }

    public static get metaData(): any {
        return this._metaData;
    }

    protected static async createInstance(meta: MetaInterface, instantiatedByMeta: MetaInterface): Promise<any> {
        if (meta.replacedBy !== undefined) {
            meta = meta.replacedBy;
        }

        if (undefined !== meta.instance) {
            return meta.instance;
        }

        meta.instantiatedBy = instantiatedByMeta;

        const children = Reflect.getMetadata('design:paramtypes', meta.function) || [];

        const instancesToInject = [];

        for (const childFunction of children) {
            const childMeta = await this.getMetaByFunction(childFunction);

            if (childMeta === undefined) {
                throw new Error(`class "${childFunction.name}" is not registered`);
            }

            instancesToInject.push(await this.createInstance(childMeta, childMeta));
        }

        meta.instance = new meta.function(...instancesToInject);
        meta.instance.__meta = meta;

        return meta.instance;
    }

    protected static async getMetaByFunction(Function: any): Promise<MetaInterface> {
        for (const meta of this._metaData) {
            if (Function === meta.function) {
                return meta;
            }
        }

        throw new Error(`class "${Function.name}" is not registered`);
    }

    protected static async enrichMetaData(): Promise<void> {
        for (const meta of this._metaData) {
            for (const metaToCheck of this._metaData) {
                if (meta.function.isPrototypeOf(metaToCheck.function)) {
                    meta.replacedBy = metaToCheck;
                }
            }
        }
    }
}

import 'reflect-metadata';
import { MetaInterface } from '@vokus/core';
import { StringComponent } from '@vokus/string';
export class ContainerComponent {
    protected static _allowedTypes: string[] = ['config', 'component', 'controller', 'middleware', 'service'];
    protected static _created = false;
    protected static _metaData: MetaInterface[] = [];

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static register(Function: any): void {
        // check if already created and throw error
        if (this._created) {
            throw new Error('register() not allowed after create() call');
        }

        // do not register if already registered
        for (const meta of this._metaData) {
            if (Function === meta.function) {
                return;
            }
        }

        // get type from function name
        const type = StringComponent.slugify(Function.name.split(/(?=[A-Z][^A-Z]+$)/).pop());

        // check if type allowed
        if (!this._allowedTypes.includes(type)) {
            throw new Error(`can not register "${Function.name}" - type "${type}" not allowed`);
        }

        // get key from function name
        const key = StringComponent.slugify(Function.name).replace('-' + type, '');

        // add meta data object to global meta data
        this._metaData.push({
            function: Function,
            name: Function.name,
            key: key,
            type: type,
            replacedBy: undefined,
            instance: undefined,
            instantiatedBy: undefined,
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static async create<T>(Function: any): Promise<T> {
        if (!this._created) {
            this.register(ContainerComponent);
            await this.enrichMetaData();
            this._created = true;
        }

        return await this.createInstance(await this.getMeta(Function), await this.getMeta(ContainerComponent));
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
            instancesToInject.push(await this.createInstance(await this.getMeta(childFunction), meta));
        }

        meta.instance = new meta.function(...instancesToInject);
        meta.instance.__meta = meta;

        return meta.instance;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected static async getMeta(Function: any): Promise<MetaInterface> {
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

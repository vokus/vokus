import 'reflect-metadata';

import { MetaType } from '../type/meta';
import { String } from '@vokus/string';

export class ObjectManager {
    protected static _created = false;
    protected static _metaData: MetaType[] = [];

    static register(Function: any): void {
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
        let type = String.slugify(Function.name.split(/(?=[A-Z][^A-Z]+$)/).pop());

        // check if type allowed
        if (!['controller', 'middleware'].includes(type)) {
            type = 'component';
        }

        // get key from function name
        const key = String.slugify(Function.name).replace('-' + type, '');

        const meta = {
            function: Function,
            name: Function.name,
            key: key,
            type: type,
            replacedBy: undefined,
            instance: undefined,
            instantiatedBy: undefined,
        };

        // add meta data object to global meta data
        this._metaData.push(meta);
    }

    static async get<T>(Function: any): Promise<T> {
        if (!this._created) {
            this.register(ObjectManager);
            await this.enrichMetaData();
            this._created = true;
        }

        return await this.createInstance(await this.getMeta(Function), await this.getMeta(ObjectManager));
    }

    protected static async createInstance(meta: MetaType, instantiatedByMeta: MetaType): Promise<any> {
        if (meta.replacedBy !== undefined) {
            meta = meta.replacedBy;
        }

        // create a new instance if is type of logger
        if (
            'function' === typeof meta.function.prototype.emergency &&
            'function' === typeof meta.function.prototype.alert &&
            'function' === typeof meta.function.prototype.critical &&
            'function' === typeof meta.function.prototype.error &&
            'function' === typeof meta.function.prototype.warning &&
            'function' === typeof meta.function.prototype.notice &&
            'function' === typeof meta.function.prototype.info &&
            'function' === typeof meta.function.prototype.debug
        ) {
            meta = Object.assign({}, meta);
        } else if (undefined !== meta.instance) {
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

    protected static async getMeta(Function: any): Promise<MetaType> {
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
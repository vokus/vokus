export interface MetaInterface {
    constructor: any;
    name: string;
    key: string;
    type: string;
    replacedBy: MetaInterface | undefined;
    instance: any;
    instantiatedBy: MetaInterface | undefined;
}

export interface MetaInterface {
    function: any;
    name: string;
    key: string;
    type: string;
    replacedBy: MetaInterface | undefined;
    instance: any;
    instantiatedBy: MetaInterface | undefined;
}

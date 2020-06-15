export type MetaType = {
    function: any;
    name: string;
    key: string;
    type: string;
    replacedBy: MetaType | undefined;
    instance: any;
    instantiatedBy: MetaType | undefined;
    options: any;
};

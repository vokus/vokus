export interface MiddlewareConfigInterface {
    key: string;
    controller: any;
    after?: string;
    before?: string;
}

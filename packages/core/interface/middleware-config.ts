export interface MiddlewareConfigInterface {
    after?: string;
    before?: string;
    key: string;
    middleware: any;
}

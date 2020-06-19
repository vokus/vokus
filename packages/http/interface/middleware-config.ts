export interface MiddlewareConfigInterface {
    key: string;
    middleware: any;
    after?: string;
    before?: string;
}

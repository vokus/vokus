export interface MiddlewareConfigurationInterface {
    after?: string;
    before?: string;
    key: string;
    middleware: any;
}

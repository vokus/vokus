export interface RouteConfigurationInterface {
    after?: string;
    before?: string;
    controller: any;
    key: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
}

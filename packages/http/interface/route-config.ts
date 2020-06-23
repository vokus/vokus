export interface RouteConfigInterface {
    after?: string;
    before?: string;
    controller: any;
    key: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
}

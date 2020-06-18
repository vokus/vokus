export interface RouteConfigInterface {
    key: string;
    path: string;
    controller: any;
    after?: string;
    before?: string;
}

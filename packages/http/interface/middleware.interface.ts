export interface MiddlewareInterface {
    active: boolean;
    after: string;
    before: string;
    key: string;
    function: any;
}

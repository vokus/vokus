export class Response {
    protected _statusCode: number;
    protected _body: string;

    constructor(statusCode: number, body: string) {
        this._statusCode = statusCode;
        this._body = body;
    }

    get statusCode(): number {
        return this._statusCode;
    }

    get body(): string {
        return this._body;
    }
}

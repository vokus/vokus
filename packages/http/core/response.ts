export class Response {
    protected _statusCode: number;
    protected _body: string;

    public constructor(statusCode: number, body: string) {
        this._statusCode = statusCode;
        this._body = body;
    }

    public get statusCode(): number {
        return this._statusCode;
    }

    public get body(): string {
        return this._body;
    }
}

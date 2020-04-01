import { ConfigDecorator } from '@vokus/dependency-injection';

@ConfigDecorator()
export class HTTPServerConfig {
    protected _pathToCert = 'config/http-server/cert.pem';

    public get pathToCert(): string {
        return this._pathToCert;
    }
}

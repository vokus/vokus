import { EnvironmentVariable } from '@vokus/environment';
import { Injectable } from '@vokus/dependency-injection';

@Injectable()
export class HTTPServerConfig {
    @EnvironmentVariable({
        name: 'HTTP_SERVER_PORT',
        example: 443,
        required: true,
        default: 443,
    })
    protected _port: number;

    get port(): number {
        return this._port;
    }
}

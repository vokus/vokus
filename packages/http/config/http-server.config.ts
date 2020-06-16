import { Config } from '@vokus/dependency-injection';
import { EnvironmentVariable } from '@vokus/environment';

@Config()
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

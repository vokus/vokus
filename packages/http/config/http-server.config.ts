import { ConfigDecorator } from '@vokus/dependency-injection';
import { EnvironmentVariableDecorator } from '@vokus/environment';

@ConfigDecorator()
export class HTTPServerConfig {
    @EnvironmentVariableDecorator({
        name: 'HTTP_SERVER_PORT',
        example: 443,
        required: true,
        default: 443,
    })
    protected _port: number;

    public get port(): number {
        return this._port;
    }
}

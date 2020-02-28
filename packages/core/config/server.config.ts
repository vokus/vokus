import ConfigDecorator from '../decorator/config.decorator';
import EnvironmentVariableDecorator from '../decorator/environment-variable.decorator';

@ConfigDecorator()
export default class ServerConfig {
    @EnvironmentVariableDecorator({
        name: 'SERVER_PORT',
        example: 80,
    })
    protected _port: number;

    public get port(): number {
        return this._port;
    }
}

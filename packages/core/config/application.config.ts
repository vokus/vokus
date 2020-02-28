import ConfigDecorator from '../decorator/config.decorator';
import EnvironmentVariableDecorator from '../decorator/environment-variable.decorator';

@ConfigDecorator()
export default class ApplicationConfig {
    @EnvironmentVariableDecorator({
        name: 'NODE_ENV',
        example: 'production',
    })
    protected _context: string;

    @EnvironmentVariableDecorator({
        name: 'APP_CLUSTER',
        example: true,
        required: true,
    })
    protected _cluster: boolean;

    protected _rootPath: string;
    protected _startDate: Date;

    constructor() {
        this._rootPath = process.cwd();
        this._startDate = new Date();
    }

    public get cluster(): boolean {
        return this._cluster;
    }

    public get context(): string {
        return this._context;
    }

    public get rootPath(): string {
        return this._rootPath;
    }

    public get startDate(): Date {
        return this._startDate;
    }

    public isProduction(): boolean {
        return this._context === 'production';
    }

    public isAcceptance(): boolean {
        return this._context === 'acceptance';
    }

    public isStaging(): boolean {
        return this._context === 'staging';
    }

    public isTest(): boolean {
        return this._context === 'test';
    }

    public isDevelopment(): boolean {
        return this._context === 'development';
    }
}

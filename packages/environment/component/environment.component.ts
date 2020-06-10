import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';
import { FileSystemComponent } from '@vokus/file-system';
import dotenv from 'dotenv';
import path from 'path';

export class EnvironmentComponent {
    protected static readonly _contextProduction: string = 'production';
    protected static readonly _contextAcceptance: string = 'acceptance';
    protected static readonly _contextStaging: string = 'staging';
    protected static readonly _contextTest: string = 'test';
    protected static readonly _contextDevelopment: string = 'development';

    protected static _contextDotEnvLoaded = false;
    protected static _variables: { [name: string]: EnvironmentVariableInterface } = {};
    protected static _values: { [name: string]: string | number | boolean | undefined } = {};

    public static get context(): string {
        this.ensureContextVariableExists();

        return String(this._values.NODE_ENV);
    }

    public static isInContextProduction(): boolean {
        return this.context === this._contextProduction;
    }

    public static isInContextAcceptance(): boolean {
        return this.context === this._contextAcceptance;
    }

    public static isInContextStaging(): boolean {
        return this.context === this._contextStaging;
    }

    public static isInContextTest(): boolean {
        return this.context === this._contextTest;
    }

    public static isInContextDevelopment(): boolean {
        return this.context === this._contextDevelopment;
    }

    public static get projectPath(): string {
        return process.cwd();
    }

    public static get publicPath(): string {
        return path.join(process.cwd(), 'public');
    }

    public static get configPath(): string {
        return path.join(process.cwd(), 'config');
    }

    public static registerEnvironmentVariable(environmentVariable: EnvironmentVariableInterface): void {
        // check if already registered
        if ('undefined' !== typeof this._variables[environmentVariable.name]) {
            throw new Error(`environment variable ${environmentVariable.name} already registered`);
        }

        // check if example and default in allowedValues
        if ('object' === typeof environmentVariable.allowedValues) {
            if (
                'undefined' !== typeof environmentVariable.default &&
                !environmentVariable.allowedValues.includes(environmentVariable.default as never)
            ) {
                throw new Error(
                    `problem with configuration of environment variable ${environmentVariable.name}: default value not in allowed values`,
                );
            }

            if (
                'undefined' !== typeof environmentVariable.example &&
                !environmentVariable.allowedValues.includes(environmentVariable.example as never)
            ) {
                throw new Error(
                    `problem with configuration of environment variable ${environmentVariable.name}: example not in allowed values`,
                );
            }
        }

        // check if type of default equal to type of example
        if (
            'undefined' !== typeof environmentVariable.default &&
            typeof environmentVariable.default !== typeof environmentVariable.example
        ) {
            throw new Error(
                `problem with configuration of ${environmentVariable.name}: type of example not equal to type of default`,
            );
        }

        this._variables[environmentVariable.name] = environmentVariable;

        // sort environment variables
        const orderedVariables: { [name: string]: EnvironmentVariableInterface } = {};
        Object.keys(this._variables)
            .sort()
            .forEach((key) => {
                orderedVariables[key] = this._variables[key];
            });

        this._variables = orderedVariables;
    }

    protected static ensureContextVariableExists(): void {
        // register NODE_ENV if not exists
        if (undefined === this._values.NODE_ENV) {
            this.registerEnvironmentVariable({
                name: 'NODE_ENV',
                example: 'production',
                required: true,
                default: 'production',
                allowedValues: [
                    this._contextProduction,
                    this._contextAcceptance,
                    this._contextStaging,
                    this._contextTest,
                    this._contextDevelopment,
                ],
            });

            this._values.NODE_ENV = this.getValueFromProcessEnv(this._variables.NODE_ENV);
        }
    }

    public static getValueFromEnvironmentVariable(
        environmentVariable: EnvironmentVariableInterface,
    ): string | number | boolean | undefined {
        // check if value already set and return that value
        if ('undefined' !== typeof this._values[environmentVariable.name]) {
            return this._values[environmentVariable.name];
        }

        // ensure node env variable exists
        this.ensureContextVariableExists();

        // load context.env
        if (!this._contextDotEnvLoaded) {
            this._loadContextSpecificDotEnv();
        }

        this._values[environmentVariable.name] = this.getValueFromProcessEnv(environmentVariable);

        this._updateDotEnvFiles();

        return this._values[environmentVariable.name];
    }

    protected static _loadContextSpecificDotEnv(): void {
        FileSystemComponent.ensureFileExistsSync(this._values.NODE_ENV + '.env');
        dotenv.config({ path: this._values.NODE_ENV + '.env' });
        this._contextDotEnvLoaded = true;
    }

    protected static getValueFromProcessEnv(
        environmentVariable: EnvironmentVariableInterface,
    ): string | number | boolean | undefined {
        let value = process.env[environmentVariable.name] as string | number | boolean;

        if ('string' !== typeof value || 0 === value.length) {
            if ('undefined' !== typeof environmentVariable.default) {
                value = environmentVariable.default;
            } else {
                this._updateDotEnvFiles();
                throw new Error(`environment variable ${environmentVariable.name} was not set`);
            }
        }

        if ('string' === typeof environmentVariable.example) {
            return this._checkEnvironmentVariableValue(environmentVariable, value);
        }

        value = Number(value);

        // check if value is valid number
        if (Number.isNaN(value)) {
            this._updateDotEnvFiles();
            throw new Error(`environment variable ${environmentVariable.name} is not a number`);
        }

        if ('number' === typeof environmentVariable.example) {
            return this._checkEnvironmentVariableValue(environmentVariable, value);
        }

        return this._checkEnvironmentVariableValue(environmentVariable, Boolean(value));
    }

    protected static _checkEnvironmentVariableValue(
        environmentVariable: EnvironmentVariableInterface,
        value: string | number | boolean,
    ): string | number | boolean {
        if (
            'object' !== typeof environmentVariable.allowedValues ||
            (environmentVariable.allowedValues.includes(value as never) &&
                environmentVariable.allowedValues.includes(environmentVariable.example as never))
        ) {
            return value;
        }

        this._updateDotEnvFiles();
        throw new Error(`environment variable ${environmentVariable.name} not in the allowed values`);
    }

    protected static _updateDotEnvFiles(): void {
        const orderedVariables: { [name: string]: EnvironmentVariableInterface } = {};
        Object.keys(this._variables)
            .sort()
            .forEach((key) => {
                orderedVariables[key] = this._variables[key];
            });

        this._variables = orderedVariables;

        const data = [];

        for (const environmentVariable of Object.values(this._variables)) {
            if ('NODE_ENV' === environmentVariable.name) {
                continue;
            }
            let example = environmentVariable.example;

            if ('boolean' === typeof example) {
                example = Number(example);
            }

            const comments = [];

            if (undefined === environmentVariable.required || true === environmentVariable.required) {
                comments.push('required');
            } else {
                comments.push('optional');
            }

            comments.push(`example: ${environmentVariable.example}`);

            if ('object' === typeof environmentVariable.allowedValues) {
                comments.push(`allowed: ${environmentVariable.allowedValues.join(' | ')}`);
            }

            data.push(`# ${comments.join(' - ')}`);

            if ('undefined' !== typeof environmentVariable.default) {
                data.push(`${environmentVariable.name}=${environmentVariable.default}`);
            } else {
                data.push(`${environmentVariable.name}=`);
            }
        }

        const pathToExampleDotEnv = path.join(this.configPath, 'example.env');

        FileSystemComponent.ensureFileExistsSync(pathToExampleDotEnv);
        FileSystemComponent.writeFileSync(pathToExampleDotEnv, data.join('\n'));
    }
}

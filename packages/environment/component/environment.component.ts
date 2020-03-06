import dotenv from 'dotenv';
import { EnvironmentVariableError } from '../error/environment-variable.error';
import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';
import { FileSystemComponent } from '@vokus/file-system';
import path from 'path';

export class EnvironmentComponent {
    protected static readonly _contextProduction: string = 'production';
    protected static readonly _contextAcceptance: string = 'acceptance';
    protected static readonly _contextStaging: string = 'staging';
    protected static readonly _contextTest: string = 'test';
    protected static readonly _contextDevelopment: string = 'development';

    protected static ensureContextVariableExists(): void {
        // register NODE_ENV if not exists
        if (undefined === this._values.NODE_ENV) {
            this._variables.NODE_ENV = {
                name: 'NODE_ENV',
                example: 'production',
                allowedValues: [
                    this._contextProduction,
                    this._contextAcceptance,
                    this._contextStaging,
                    this._contextTest,
                    this._contextDevelopment,
                ],
                required: true,
            };

            this._values.NODE_ENV = this.getValueFromEnv(this._variables.NODE_ENV);
        }
    }

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

    public static getValue(environmentVariable: EnvironmentVariableInterface): string | number | boolean | undefined {
        // check if value already set and return
        if (undefined !== this._values[environmentVariable.name]) {
            return this._values[environmentVariable.name];
        }

        this.ensureContextVariableExists();

        // load context.env
        if (!this._contextDotEnvLoaded) {
            this._loadContextSpecificDotEnv();
        }

        this._variables[environmentVariable.name] = environmentVariable;
        this._values[environmentVariable.name] = this.getValueFromEnv(environmentVariable);

        this._updateDotEnvFiles();

        return this._values[environmentVariable.name];
    }

    protected static _contextDotEnvLoaded: boolean = false;
    protected static _variables: { [name: string]: EnvironmentVariableInterface } = {};
    protected static _values: { [name: string]: string | number | boolean | undefined } = {};

    protected static _loadContextSpecificDotEnv(): void {
        FileSystemComponent.ensureFileExistsSync(this._values.NODE_ENV + '.env');
        dotenv.config({ path: this._values.NODE_ENV + '.env' });
        this._contextDotEnvLoaded = true;
    }

    protected static getValueFromEnv(
        environmentVariable: EnvironmentVariableInterface,
    ): string | number | boolean | undefined {
        let value = process.env[environmentVariable.name] as any;

        if ('string' !== typeof value || 0 === value.length) {
            this._updateDotEnvFiles();
            throw new EnvironmentVariableError(environmentVariable);
        }

        if ('string' === typeof environmentVariable.example) {
            return this._checkEnvironmentVariable(environmentVariable, value);
        }

        value = Number(value);

        // check if value is valid number
        if (Number.isNaN(value)) {
            this._updateDotEnvFiles();
            throw new EnvironmentVariableError(environmentVariable);
        }

        if ('number' === typeof environmentVariable.example) {
            return this._checkEnvironmentVariable(environmentVariable, value);
        }

        return this._checkEnvironmentVariable(environmentVariable, Boolean(value));
    }

    protected static _checkEnvironmentVariable(
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
        throw new EnvironmentVariableError(environmentVariable);
    }

    protected static _updateDotEnvFiles(): void {

        const orderedVariables: { [name: string]: EnvironmentVariableInterface } = {};
        Object.keys(this._variables)
            .sort()
            .forEach(key => {
                orderedVariables[key] = this._variables[key];
            });

        this._variables = orderedVariables;

        const pathToExampleDotEnv = 'example.env';

        FileSystemComponent.ensureFileExistsSync(pathToExampleDotEnv);

        const data = [];

        for (const [name, environmentVariable] of Object.entries(this._variables)) {
            if (name === 'NODE_ENV') {
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

            comments.push(`example: '${environmentVariable.example}'`);

            if ('object' === typeof environmentVariable.allowedValues) {
                comments.push(`allowed: '${environmentVariable.allowedValues.join(' | ')}'`);
            }

            data.push(`# ${comments.join(' - ')}`);
            data.push(`${name}=${example}`);
        }

        FileSystemComponent.writeFileSync(pathToExampleDotEnv, data.join('\n'));
    }
}

import dotenv from 'dotenv';
import { EnvironmentVariableError } from '../error/environment-variable.error';
import { FileSystem } from '@vokus/file-system';
import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

export class EnvironmentComponent {
    public static getValue(environmentVariable: EnvironmentVariableInterface): string | number | boolean | undefined {
        // check if value already set and return
        if (undefined !== this._values[environmentVariable.name]) {
            return this._values[environmentVariable.name];
        }

        // register NODE_ENV if not exists
        if (undefined === this._variables.NODE_ENV) {
            this._variables.NODE_ENV = {
                name: 'NODE_ENV',
                example: 'production',
                allowedValues: ['production', 'acceptance', 'staging', 'test', 'development'],
                required: true,
            };

            this._values.NODE_ENV = this.getValueFromEnv(this._variables.NODE_ENV);
        }

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
        FileSystem.ensureFileExistsSync(this._values.NODE_ENV + '.env');
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

        if (
            undefined !== environmentVariable.allowedValues &&
            !environmentVariable.allowedValues.includes(environmentVariable.example as never)
        ) {
            this._updateDotEnvFiles();
            throw new EnvironmentVariableError(environmentVariable);
        }

        if ('string' === typeof environmentVariable.example) {
            return value;
        }

        value = Number(value);

        // check if value is valid number
        if (Number.isNaN(value)) {
            this._updateDotEnvFiles();
            throw new EnvironmentVariableError(environmentVariable);
        }

        if ('number' === typeof environmentVariable.example) {
            return value;
        }

        return Boolean(value);
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

        FileSystem.ensureFileExistsSync(pathToExampleDotEnv);

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

            data.push(`# ${comments.join(' - ')}`);
            data.push(`${name}=${example}`);
        }

        FileSystem.writeFileSync(pathToExampleDotEnv, data.join('\n'));
    }
}

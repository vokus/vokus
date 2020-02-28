import dotenv from 'dotenv';
import { EnvironmentVariableError } from '../error/environment-variable.error';
import { FileSystem } from '..';
import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

export class EnvironmentComponent {
    public static getValue(environmentVariable: EnvironmentVariableInterface): string | number | boolean | undefined {
        // check if value already set and return
        if (undefined !== this._values[environmentVariable.name]) {
            return this._values[environmentVariable.name];
        }

        // register NODE_ENV if not exists
        if (undefined === this._values.NODE_ENV) {
            this._variables.NODE_ENV = {
                name: 'NODE_ENV',
                example: 'production',
                allowedValues: ['production', 'staging', 'acceptance', 'test', 'development'],
                required: true,
            };

            this._values.NODE_ENV = this.getValueFromEnv('NODE_ENV');
        }

        // load context.env
        if (!this._contextDotEnvLoaded) {
            this._loadContextDotEnv();
        }

        this._variables[environmentVariable.name] = environmentVariable;

        return (this._values[environmentVariable.name] = this.getValueFromEnv(environmentVariable.name));
    }

    protected static _contextDotEnvLoaded: boolean = false;
    protected static _variables: { [name: string]: EnvironmentVariableInterface } = {};
    protected static _values: { [name: string]: string | number | boolean | undefined } = {};

    protected static _loadContextDotEnv(): void {
        const pathToContextDotEnv = this._values.NODE_ENV + '.env';
        FileSystem.ensureFileExistsSync(pathToContextDotEnv);

        dotenv.config({ path: pathToContextDotEnv });
        this._contextDotEnvLoaded = true;
    }

    protected static _updateDotEnvFiles(): void {
        const orderedVariables: {
            [name: string]: EnvironmentVariableInterface;
        } = {};
        Object.keys(this._variables)
            .sort()
            .forEach(key => {
                orderedVariables[key] = this._variables[key];
            });

        this._variables = orderedVariables;

        const pathToExampleDotEnv = 'example.env';

        FileSystem.removeSync(pathToExampleDotEnv);
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

        FileSystem.appendFileSync(pathToExampleDotEnv, data.join('\n'));
    }

    protected static getValueFromEnv(name: string): string | number | boolean | undefined {
        const environmentVariable = this._variables[name];
        let value = process.env[name] as any;

        if (false === environmentVariable.required) {
            return undefined;
        }

        if ('string' !== typeof value || 0 === value.length) {
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
}

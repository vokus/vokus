import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

export class EnvironmentVariableError extends Error {
    constructor(environmentVariable: EnvironmentVariableInterface, message?: string) {
        const messages = [`environment variable ${environmentVariable.name} not valid`];
        let example = environmentVariable.example;
        let allowedValues = environmentVariable.allowedValues;

        if (typeof example === 'boolean') {
            example = Number(example);

            if ('undefined' !== typeof allowedValues) {
                const mappedAllowedValues: boolean[] = [];
                for (const allowedValue of Object.values(allowedValues)) {
                    mappedAllowedValues.push(Number(allowedValue) as never);
                }

                allowedValues = mappedAllowedValues;
            }
        }

        messages.push(`example: ${example}`);

        if (typeof allowedValues === 'object') {
            messages.push(`allowed values: [ ${allowedValues.join(' | ')} ]`);
        }

        if (typeof message === 'string') {
            messages.push(message);
        }

        super(messages.join(' - '));
    }
}

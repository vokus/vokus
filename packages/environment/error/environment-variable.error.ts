import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

export class EnvironmentVariableError extends Error {
    constructor(environmentVariable: EnvironmentVariableInterface) {
        const messages = [`environment variable '${environmentVariable.name}' not valid`];
        let example = environmentVariable.example;
        const allowedValues = environmentVariable.allowedValues;

        if (typeof example === 'boolean') {
            example = Number(example);
        }

        messages.push(`example: '${example}'`);

        if (typeof allowedValues !== 'undefined') {
            messages.push(`allowed values: '${allowedValues.join(' | ')}'`);
        }

        super(messages.join(' - '));
    }
}

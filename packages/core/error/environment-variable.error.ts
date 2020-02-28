import EnvironmentVariableInterface from '../interface/environment-variable.interface';

// TODO: optimize for types
export default class EnvironmentVariableError extends Error {
    constructor(environmentVariable: EnvironmentVariableInterface) {
        const parts = [`${environmentVariable.name} not set or not valid`];
        let example = environmentVariable.example;
        const allowedValues = environmentVariable.allowedValues;

        if ('boolean' === typeof example) {
            example = Number(example);
        }

        parts.push(`example: ${example}`);

        if ('undefined' !== typeof allowedValues) {
            parts.push(`allowed values: ${allowedValues.join(' | ')}`);
        }

        super(parts.join(' - '));
    }
}

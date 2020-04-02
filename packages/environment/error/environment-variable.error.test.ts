import { EnvironmentVariableError } from './environment-variable.error';

describe('EnvironmentVariableError', () => {
    test('throw', async () => {
        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_STRING',
                example: 'string',
                required: true,
            });
        }).toThrowError('environment variable TEST_STRING not valid - example: string');

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_STRING',
                example: 'string',
                required: true,
            });
        }).toThrowError('environment variable TEST_STRING not valid - example: string');

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_STRING',
                example: 'test',
                required: true,
                allowedValues: ['test', 'abc', 'john doe'],
            });
        }).toThrowError(
            'environment variable TEST_STRING not valid - example: test - allowed values: [ test | abc | john doe ]',
        );

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_NUMBER',
                example: 10,
                required: true,
            });
        }).toThrowError('environment variable TEST_NUMBER not valid - example: 10');

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_BOOLEAN',
                example: true,
                required: true,
            });
        }).toThrowError('environment variable TEST_BOOLEAN not valid - example: 1');
    });
});

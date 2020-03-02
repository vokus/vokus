import { EnvironmentVariableError } from './environment-variable.error';

describe('EnvironmentVariableError', () => {
    test('throw', async () => {
        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_STRING',
                example: 'string',
            });
        }).toThrowError('TEST_STRING not set or not valid - example: string');

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_STRING',
                example: 'string',
                required: true,
            });
        }).toThrowError('TEST_STRING not set or not valid - example: string');

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_STRING',
                example: 'test',
                required: true,
                allowedValues: ['test', 'abc', 'john doe'],
            });
        }).toThrowError('TEST_STRING not set or not valid - example: test - allowed values: test | abc | john doe');

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_NUMBER',
                example: 10,
            });
        }).toThrowError('TEST_NUMBER not set or not valid - example: 10');

        expect(() => {
            throw new EnvironmentVariableError({
                name: 'TEST_BOOLEAN',
                example: true,
            });
        }).toThrowError('TEST_BOOLEAN not set or not valid - example: 1');
    });
});

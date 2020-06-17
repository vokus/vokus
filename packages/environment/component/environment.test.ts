process.env.TEST_DECORATOR_BOOLEAN = '1';
process.env.TEST_DECORATOR_NUMBER = '44';
process.env.TEST_DECORATOR_STRING = 'test';
process.env.TEST_INVALID_NUMBER_2 = 'test';
process.env.TEST_INVALID_STRING_3 = 'any other string';

import { Environment, EnvironmentVariable, EnvironmentVariableInterface } from '../index';
import { FileSystemComponent } from '@vokus/file-system';
import { StringComponent } from '@vokus/string';

function getEnvName(
    type: string,
    example: string | number | boolean,
    required: boolean,
    defaultValue: boolean,
    allowedValues: boolean,
): string {
    return [
        'test',
        'generated',
        StringComponent.slugify(type, '_'),
        StringComponent.slugify(String(example), '_'),
        StringComponent.slugify(String(required), '_'),
        StringComponent.slugify(String(defaultValue), '_'),
        StringComponent.slugify(String(allowedValues), '_'),
    ]
        .join('_')
        .toUpperCase();
}

const environmentVariables: { [name: string]: EnvironmentVariableInterface } = {};

for (const type of ['boolean', 'number', 'string']) {
    for (const example of ['test', true, false, 54637.4, -234, 0]) {
        if (type !== typeof example) {
            continue;
        }

        for (const required of [true, false]) {
            for (const defaultValue of [true, false]) {
                for (const allowedValues of [true, false]) {
                    const name = getEnvName(type, example, required, defaultValue, allowedValues);

                    const environmentVariable: EnvironmentVariableInterface = {
                        name: name,
                        example: example,
                        required: required,
                    };

                    if (defaultValue) {
                        environmentVariable.default = example;
                    }

                    if (allowedValues) {
                        environmentVariable.allowedValues = [];
                        environmentVariable.allowedValues.push(example as never);

                        if ('string' === typeof example) {
                            environmentVariable.allowedValues.push('any other string' as never);
                        }

                        if ('number' === typeof example) {
                            environmentVariable.allowedValues.push(12 as never);
                        }
                    }

                    environmentVariables[name] = environmentVariable;
                }
            }
        }
    }
}

const invalidEnvironmentVariables: { [name: string]: EnvironmentVariableInterface } = {
    TEST_INVALID_BOOLEAN: {
        name: 'TEST_INVALID_BOOLEAN',
        example: true,
        required: true,
        allowedValues: [false],
        default: true,
    },
    TEST_INVALID_NUMBER: {
        name: 'TEST_INVALID_NUMBER',
        example: 10,
        required: true,
        allowedValues: [1],
    },
    TEST_INVALID_NUMBER_2: {
        name: 'TEST_INVALID_NUMBER_2',
        example: 10,
        required: true,
    },
    TEST_INVALID_STRING: {
        name: 'TEST_INVALID_STRING',
        example: 'any test string',
        required: false,
        allowedValues: ['test'],
    },
    TEST_INVALID_STRING_2: {
        name: 'TEST_INVALID_STRING_2',
        example: 'any test string',
        required: false,
        default: 10,
    },
    TEST_INVALID_STRING_3: {
        name: 'TEST_INVALID_STRING_3',
        example: 'test',
        required: true,
        allowedValues: ['test'],
    },
};

class Config {
    @EnvironmentVariable({
        name: 'TEST_DECORATOR_BOOLEAN',
        example: true,
        required: true,
    })
    protected _testBoolean: boolean;

    @EnvironmentVariable({
        name: 'TEST_DECORATOR_NUMBER',
        example: 14,
        required: false,
        default: 10,
    })
    protected _testNumber: number;

    @EnvironmentVariable({
        name: 'TEST_DECORATOR_STRING',
        example: 'any test string',
        required: true,
    })
    protected _testString: string;

    get testBoolean(): boolean {
        return this._testBoolean;
    }

    get testNumber(): number {
        return this._testNumber;
    }

    get testString(): string {
        return this._testString;
    }
}

afterAll(async () => {
    await FileSystemComponent.remove(Environment.configPath);
});

describe('Environment', () => {
    test('context', () => {
        expect(Environment.context).toBe('test');
    });

    test('isInContextProduction', () => {
        expect(Environment.isInContextProduction()).toBe(false);
    });

    test('isInContextAcceptance', () => {
        expect(Environment.isInContextAcceptance()).toBe(false);
    });

    test('isInContextStaging', () => {
        expect(Environment.isInContextStaging()).toBe(false);
    });

    test('isInContextTest', () => {
        expect(Environment.isInContextTest()).toBe(true);
    });

    test('isInContextDevelopment', () => {
        expect(Environment.isInContextDevelopment()).toBe(false);
    });

    test('projectPath', () => {
        expect(Environment.projectPath).toBe(process.cwd());
    });

    test('publicPath', async () => {
        expect(Environment.publicPath).toMatch(/public/);
    });

    test('configPath', async () => {
        expect(Environment.configPath).toMatch(/config/);
    });

    test('registerEnvironmentVariable', async () => {
        for (const environmentVariable of Object.values(environmentVariables)) {
            Environment.registerEnvironmentVariable(environmentVariable);
        }

        // try register environment variable that has already been registered
        expect(() => {
            Environment.registerEnvironmentVariable(environmentVariables.TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE);
        }).toThrowError('environment variable TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE already registered');

        expect(() => {
            Environment.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_BOOLEAN);
        }).toThrowError(
            'problem with configuration of environment variable TEST_INVALID_BOOLEAN: default value not in allowed values',
        );

        expect(() => {
            Environment.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_NUMBER);
        }).toThrowError(
            'problem with configuration of environment variable TEST_INVALID_NUMBER: example not in allowed values',
        );

        expect(() => {
            Environment.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_STRING);
        }).toThrowError(
            'problem with configuration of environment variable TEST_INVALID_STRING: example not in allowed values',
        );

        expect(() => {
            Environment.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_STRING_2);
        }).toThrowError(
            'problem with configuration of TEST_INVALID_STRING_2: type of example not equal to type of default',
        );
    });

    test('getValueFromEnvironmentVariable', async () => {
        const config = new Config();

        expect(config.testBoolean).toBe(true);
        expect(config.testNumber).toBe(44);
        expect(config.testString).toBe('test');

        // try to get value from env which not set
        expect(() => {
            Environment.getValueFromEnvironmentVariable(
                environmentVariables.TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE,
            );
        }).toThrowError('environment variable TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE was not set');

        expect(
            Environment.getValueFromEnvironmentVariable(
                environmentVariables.TEST_GENERATED_BOOLEAN_TRUE_TRUE_TRUE_FALSE,
            ),
        ).toBe(true);

        expect(
            Environment.getValueFromEnvironmentVariable({
                name: 'TEST_DECORATOR_STRING',
                example: 'any test string',
                required: true,
            }),
        ).toBe('test');

        // try to get a number with is a string
        expect(() => {
            Environment.getValueFromEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_NUMBER_2);
        }).toThrowError('environment variable TEST_INVALID_NUMBER_2 is not a number');

        // try to get a value which is not in the allowed values
        expect(() => {
            Environment.getValueFromEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_STRING_3);
        }).toThrowError('environment variable TEST_INVALID_STRING_3 not in the allowed values');
    });
});

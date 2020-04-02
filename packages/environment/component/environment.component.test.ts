import path from 'path';
import { EnvironmentComponent, EnvironmentVariableDecorator, EnvironmentVariableInterface } from '../index';
import { FileSystemComponent } from '@vokus/file-system';
import { StringComponent } from '@vokus/string';

process.env.TEST_DECORATOR_BOOLEAN = '1';
process.env.TEST_DECORATOR_NUMBER = '44';
process.env.TEST_DECORATOR_STRING = 'test';

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
};

// console.log(environmentVariables);

class Config {
    @EnvironmentVariableDecorator({
        name: 'TEST_DECORATOR_BOOLEAN',
        example: true,
        required: true,
    })
    protected _testBoolean: boolean;

    @EnvironmentVariableDecorator({
        name: 'TEST_DECORATOR_NUMBER',
        example: 14,
        required: false,
        default: 10,
    })
    protected _testNumber: number;

    @EnvironmentVariableDecorator({
        name: 'TEST_DECORATOR_STRING',
        example: 'any test string',
        required: true,
    })
    protected _testString: string;

    public get testBoolean(): boolean {
        return this._testBoolean;
    }

    public get testNumber(): number {
        return this._testNumber;
    }

    public get testString(): string {
        return this._testString;
    }
}

afterAll(async () => {
    // await FileSystemComponent.remove(path.join(EnvironmentComponent.configPath, 'example.env'));
    // await FileSystemComponent.remove(path.join(EnvironmentComponent.configPath, 'test.env'));
});

describe('EnvironmentComponent', () => {
    test('context', () => {
        expect(EnvironmentComponent.context).toBe('test');
    });

    test('isInContextProduction', () => {
        expect(EnvironmentComponent.isInContextProduction()).toBe(false);
    });

    test('isInContextAcceptance', () => {
        expect(EnvironmentComponent.isInContextAcceptance()).toBe(false);
    });

    test('isInContextStaging', () => {
        expect(EnvironmentComponent.isInContextStaging()).toBe(false);
    });

    test('isInContextTest', () => {
        expect(EnvironmentComponent.isInContextTest()).toBe(true);
    });

    test('isInContextDevelopment', () => {
        expect(EnvironmentComponent.isInContextDevelopment()).toBe(false);
    });

    test('projectPath', () => {
        expect(EnvironmentComponent.projectPath).toBe(process.cwd());
    });

    test('publicPath', async () => {
        expect(EnvironmentComponent.publicPath).toMatch(/public/);
    });

    test('configPath', async () => {
        expect(EnvironmentComponent.configPath).toMatch(/config/);
    });

    test('registerEnvironmentVariable', async () => {
        for (const environmentVariable of Object.values(environmentVariables)) {
            EnvironmentComponent.registerEnvironmentVariable(environmentVariable);
        }

        // try register environment variable that has already been registered
        expect(() => {
            EnvironmentComponent.registerEnvironmentVariable(
                environmentVariables.TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE,
            );
        }).toThrowError(
            'environment variable TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE not valid - example: 1 - environment variable already registered',
        );

        expect(() => {
            EnvironmentComponent.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_BOOLEAN);
        }).toThrowError(
            'environment variable TEST_INVALID_BOOLEAN not valid - example: 1 - allowed values: [ 0 ] - default value not in allowed values',
        );

        expect(() => {
            EnvironmentComponent.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_NUMBER);
        }).toThrowError(
            'environment variable TEST_INVALID_NUMBER not valid - example: 10 - allowed values: [ 1 ] - example not in allowed values',
        );

        expect(() => {
            EnvironmentComponent.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_STRING);
        }).toThrowError(
            'environment variable TEST_INVALID_STRING not valid - example: any test string - allowed values: [ test ] - example not in allowed values',
        );

        expect(() => {
            EnvironmentComponent.registerEnvironmentVariable(invalidEnvironmentVariables.TEST_INVALID_STRING_2);
        }).toThrowError(
            'environment variable TEST_INVALID_STRING_2 not valid - example: any test string - type of example not equal to default',
        );
    });

    test('getValueFromEnvironmentVariable', async () => {
        const config = new Config();

        expect(config.testBoolean).toBe(true);
        expect(config.testNumber).toBe(44);
        expect(config.testString).toBe('test');

        // try to get value from env which not set
        expect(() => {
            EnvironmentComponent.getValueFromEnvironmentVariable(
                environmentVariables.TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE,
            );
        }).toThrowError('environment variable TEST_GENERATED_BOOLEAN_TRUE_TRUE_FALSE_FALSE not valid - example: 1');

        expect(
            EnvironmentComponent.getValueFromEnvironmentVariable({
                name: 'TEST_DECORATOR_STRING',
                example: 'any test string',
                required: true,
            }),
        ).toBe('test');

        /*
        expect(() => {
            EnvironmentComponent.getValue(environmentVariables.TEST_ERROR_1);
        }).toThrowError(
            "environment variable 'TEST_ERROR_1' not valid - example: '-200' - allowed values: '-300 | 10'",
        );

        expect(() => {
            EnvironmentComponent.getValue(environmentVariables.TEST_ERROR_2);
        }).toThrowError(
            "environment variable 'TEST_ERROR_2' not valid - example: 'error' - allowed values: 'error | test'",
        );

        expect(() => {
            EnvironmentComponent.getValue(environmentVariables.TEST_ERROR_3);
        }).toThrowError("environment variable 'TEST_ERROR_3' not valid - example: 'error 3'");

        expect(() => {
            EnvironmentComponent.getValue(environmentVariables.TEST_ERROR_4);
        }).toThrowError("environment variable 'TEST_ERROR_4' not valid - example: '10'");

        expect(() => {
            EnvironmentComponent.getValue(environmentVariables.TEST_ERROR_5);
        }).toThrowError("environment variable 'TEST_ERROR_5' not valid - example: '1'");
        */
    });
});

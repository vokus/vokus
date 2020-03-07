import path from 'path';
import { EnvironmentComponent, EnvironmentVariableDecorator, EnvironmentVariableInterface } from '../index';
import { FileSystemComponent } from '@vokus/file-system';

process.env.TEST_STRING_1 = 'string';
process.env.TEST_STRING_2 = 'string 2';
process.env.TEST_NUMBER_1 = '20';
process.env.TEST_NUMBER_2 = '-300';
process.env.TEST_BOOLEAN_1 = '1';
process.env.TEST_BOOLEAN_2 = '0';
process.env.TEST_ERROR_1 = '-300';
process.env.TEST_ERROR_2 = 'abc';
process.env.TEST_ERROR_4 = 'abc';
process.env.TEST_ERROR_5 = 'abc';

const definitions: { [name: string]: EnvironmentVariableInterface } = {
    TEST_STRING_1: {
        name: 'TEST_STRING_1',
        example: 'string',
    },
    TEST_STRING_2: {
        name: 'TEST_STRING_2',
        example: 'string 2',
        required: false,
        allowedValues: ['string 2', 'test'],
    },
    TEST_NUMBER_1: {
        name: 'TEST_NUMBER_1',
        example: 10,
    },
    TEST_NUMBER_2: {
        name: 'TEST_NUMBER_2',
        example: -300,
        allowedValues: [-300, 10],
    },
    TEST_BOOLEAN_1: {
        name: 'TEST_BOOLEAN_1',
        example: true,
    },
    TEST_BOOLEAN_2: {
        name: 'TEST_BOOLEAN_2',
        example: false,
    },
    TEST_ERROR_1: {
        name: 'TEST_ERROR_1',
        example: -200,
        allowedValues: [-300, 10],
    },
    TEST_ERROR_2: {
        name: 'TEST_ERROR_2',
        example: 'error',
        allowedValues: ['error', 'test'],
    },
    TEST_ERROR_3: {
        name: 'TEST_ERROR_3',
        example: 'error 3',
    },
    TEST_ERROR_4: {
        name: 'TEST_ERROR_4',
        example: 10,
    },
    TEST_ERROR_5: {
        name: 'TEST_ERROR_5',
        example: true,
    },
};

class Config {
    @EnvironmentVariableDecorator(definitions.TEST_STRING_1)
    protected _testString1: string;

    @EnvironmentVariableDecorator(definitions.TEST_STRING_2)
    protected _testString2: string;

    @EnvironmentVariableDecorator(definitions.TEST_NUMBER_1)
    protected _testNumber1: number;

    @EnvironmentVariableDecorator(definitions.TEST_NUMBER_2)
    protected _testNumber2: number;

    @EnvironmentVariableDecorator(definitions.TEST_BOOLEAN_1)
    protected _testBoolean1: boolean;

    @EnvironmentVariableDecorator(definitions.TEST_BOOLEAN_2)
    protected _testBoolean2: boolean;

    public get testString1(): string {
        return this._testString1;
    }

    public get testString2(): string {
        return this._testString2;
    }

    public get testNumber1(): number {
        return this._testNumber1;
    }

    public get testNumber2(): number {
        return this._testNumber2;
    }

    public get testBoolean1(): boolean {
        return this._testBoolean1;
    }

    public get testBoolean2(): boolean {
        return this._testBoolean2;
    }
}

afterAll(async () => {
    await FileSystemComponent.remove(path.join(EnvironmentComponent.projectPath, 'example.env'));
    await FileSystemComponent.remove(path.join(EnvironmentComponent.projectPath, 'test.env'));
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

    test('getValue', async () => {
        const config = new Config();

        expect(config.testString1).toBe('string');
        expect(config.testString2).toBe('string 2');
        expect(config.testNumber1).toBe(20);
        expect(config.testNumber2).toBe(-300);
        expect(config.testBoolean1).toBe(true);
        expect(config.testBoolean2).toBe(false);

        expect(EnvironmentComponent.getValue(definitions.TEST_STRING_1)).toBe('string');
        expect(EnvironmentComponent.getValue(definitions.TEST_NUMBER_1)).toBe(20);

        expect(() => {
            EnvironmentComponent.getValue(definitions.TEST_ERROR_1);
        }).toThrowError(
            "environment variable 'TEST_ERROR_1' not valid - example: '-200' - allowed values: '-300 | 10'",
        );

        expect(() => {
            EnvironmentComponent.getValue(definitions.TEST_ERROR_2);
        }).toThrowError(
            "environment variable 'TEST_ERROR_2' not valid - example: 'error' - allowed values: 'error | test'",
        );

        expect(() => {
            EnvironmentComponent.getValue(definitions.TEST_ERROR_3);
        }).toThrowError("environment variable 'TEST_ERROR_3' not valid - example: 'error 3'");

        expect(() => {
            EnvironmentComponent.getValue(definitions.TEST_ERROR_4);
        }).toThrowError("environment variable 'TEST_ERROR_4' not valid - example: '10'");

        expect(() => {
            EnvironmentComponent.getValue(definitions.TEST_ERROR_5);
        }).toThrowError("environment variable 'TEST_ERROR_5' not valid - example: '1'");
    });
});

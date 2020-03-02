/* tslint:disable:max-classes-per-file */

import { EnvironmentVariableDecorator } from '../decorator/environment-variable.decorator';
import { EnvironmentComponent } from './environment.component';
import { EnvironmentVariableInterface } from '../interface/environment-variable.interface';

process.env.TEST_STRING = 'string';
process.env.TEST_STRING_2 = 'string 2';
process.env.TEST_NUMBER = '20';
process.env.TEST_NUMBER_2 = '-200';

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
    TEST_ERROR_1: {
        name: 'TEST_ERROR',
        example: -200,
        allowedValues: [-300, 10],
    },
};

class Config {
    @EnvironmentVariableDecorator(definitions.TEST_STRING_1)
    protected _testString1: string;

    @EnvironmentVariableDecorator(definitions.TEST_STRING_2)
    protected _testString2: string;

    @EnvironmentVariableDecorator(definitions.TEST_NUMBER_1)
    protected _testNumber1: string;

    @EnvironmentVariableDecorator(definitions.TEST_NUMBER_2)
    protected _testNumber2: string;

    public get testString1(): string {
        return this._testString1;
    }

    public get testString2(): string {
        return this._testString2;
    }

    public get testNumber1(): string {
        return this._testNumber1;
    }

    public get testNumber2(): string {
        return this._testNumber2;
    }
}

class ConfigError {
    @EnvironmentVariableDecorator(definitions.TEST_STRING)
    protected _testString1: string;

    public get testString1(): string {
        return this._testString1;
    }
}

describe('EnvironmentComponent', () => {
    test('get', async () => {
        const config = new Config();

        expect(config.testString1).toBe('string');
        expect(config.testString2).toBe('string 2');
        expect(config.testNumber1).toBe(20);
        expect(config.testNumber2).toBe(20);

        expect(EnvironmentComponent.getValue(definitions.TEST_STRING)).toBe('string');
        expect(EnvironmentComponent.getValue(definitions.TEST_NUMBER)).toBe(20);
    });
});

/* tslint:disable:max-classes-per-file */

import ConfigDecorator from '../decorator/config.decorator';
import EnvironmentVariableDecorator from '../decorator/environment-variable.decorator';
import ApplicationUtil from './application.util';

process.env.TEST_STRING = 'test';
process.env.TEST_NUMBER_2 = '20';
process.env.TEST_BOOLEAN = '0';
process.env.TEST_NUMBER_EMPTY_2 = 'test';

@ConfigDecorator()
class TestConfig {
    @EnvironmentVariableDecorator({
        name: 'TEST_STRING',
        example: 'string',
    })
    protected _testString: string;

    @EnvironmentVariableDecorator({
        name: 'TEST_NUMBER',
        example: 1,
        required: false,
    })
    protected _testNumber: number | undefined;

    @EnvironmentVariableDecorator({
        name: 'TEST_NUMBER_2',
        example: 12,
    })
    protected _testNumber2: number | undefined;

    @EnvironmentVariableDecorator({
        name: 'TEST_BOOLEAN',
        example: true,
    })
    protected _testBoolean: boolean;

    @EnvironmentVariableDecorator({
        name: 'TEST_BOOLEAN',
        example: true,
    })
    protected _testBoolean2: boolean;

    public get testString(): string {
        return this._testString;
    }

    public get testNumber(): number | undefined {
        return this._testNumber;
    }

    public get testNumber2(): number | undefined {
        return this._testNumber2;
    }

    public get testBoolean(): boolean {
        return this._testBoolean;
    }

    public get testBoolean2(): boolean {
        return this._testBoolean2;
    }
}

test('environment-util', async () => {
    const testConfig = await ApplicationUtil.create<TestConfig>(TestConfig);

    try {
        @ConfigDecorator()
        class TestConfigEmptyString {
            @EnvironmentVariableDecorator({
                name: 'TEST_STRING_EMPTY',
                example: 'string',
                allowedValues: ['john', 'doe'],
            })
            protected _testStringEmpty: string;
        }
    } catch (e) {
        expect(e.message).toBe('TEST_STRING_EMPTY not set or not valid - example: string - allowed values: john | doe');
    }

    try {
        @ConfigDecorator()
        class TestConfigEmptyNumber {
            @EnvironmentVariableDecorator({
                name: 'TEST_NUMBER_EMPTY',
                example: 12,
            })
            protected _testNumberEmpty: number;
        }
    } catch (e) {
        expect(e.message).toBe('TEST_NUMBER_EMPTY not set or not valid - example: 12');
    }

    try {
        @ConfigDecorator()
        class TestConfigEmptyBoolean {
            @EnvironmentVariableDecorator({
                name: 'TEST_BOOLEAN_EMPTY',
                example: true,
            })
            protected _testBooleanEmpty: boolean;
        }
    } catch (e) {
        expect(e.message).toBe('TEST_BOOLEAN_EMPTY not set or not valid - example: 1');
    }

    try {
        @ConfigDecorator()
        class TestConfigEmptyNumber2 {
            @EnvironmentVariableDecorator({
                name: 'TEST_NUMBER_EMPTY_2',
                example: 1,
                required: true,
            })
            protected _testNumberEmpty: number;
        }
    } catch (e) {
        expect(e.message).toBe('TEST_NUMBER_EMPTY_2 not set or not valid - example: 1');
    }

    expect(testConfig.testString).toBe('test');
    expect(testConfig.testNumber).toBe(undefined);
    expect(testConfig.testNumber2).toBe(20);
    expect(testConfig.testBoolean).toBe(false);
    expect(testConfig.testBoolean2).toBe(false);
});

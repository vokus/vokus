import { EnvironmentVariableDecorator } from '../decorator/environment-variable.decorator';

process.env.TEST_STRING = 'string';
process.env.TEST_NUMBER_2 = '20';
process.env.TEST_BOOLEAN = '0';
process.env.TEST_NUMBER_EMPTY_2 = 'test';

class Config {
    @EnvironmentVariableDecorator({
        name: 'TEST_STRING',
        example: 'string',
    })
    protected _testString: string;

    public get testString(): string {
        return this._testString;
    }
}

describe('EnvironmentComponent', () => {
    test('get', async () => {
        const config = new Config();

        console.log(config.testString);
        expect(config.testString).toBe('string');
    });
});

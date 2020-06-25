import { ArrayUtil } from '../index';

describe('array-util', () => {
    test('sortByBeforeAndAfter with valid data', async () => {
        const keys = ['h', 'b', 'c', 'a', 'd', 'e', 'g', 'f'];

        const config = [
            {
                after: 'c',
                key: 'a',
            },
            {
                before: 'f',
                key: 'b',
            },
            {
                before: 'a',
                key: 'c',
            },
            {
                after: 'e',
                key: 'd',
            },
            {
                before: 'e',
                key: 'd',
            },
            {
                after: 'a',
                key: 'e',
            },
            {
                after: 'b',
                key: 'f',
            },
            {
                after: 'b',
                before: 'f',
                key: 'g',
            },
            {
                before: 'b',
                key: 'h',
            },
        ];

        const result = await ArrayUtil.sortByBeforeAndAfter(config);

        const keysResult: string[] = [];

        for (const item of result) {
            keysResult.push(item.key);
        }

        expect(keysResult).toStrictEqual(keys);
    });

    test('sortByBeforeAndAfter with invalid data', async () => {
        const config = [
            {
                after: 'c',
                key: 'a',
            },
        ];

        try {
            await ArrayUtil.sortByBeforeAndAfter(config);
        } catch (e) {
            expect(e).toEqual(new Error("after 'c' is not a valid key"));
        }

        const config2 = [
            {
                before: 'c',
                key: 'a',
            },
        ];

        try {
            await ArrayUtil.sortByBeforeAndAfter(config2);
        } catch (e) {
            expect(e).toEqual(new Error("before 'c' is not a valid key"));
        }
    });
});

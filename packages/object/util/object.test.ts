import { ObjectUtil } from '../index';

describe('object-util', () => {
    test('merge', async () => {
        const target = {
            a: [1, 2],
            b: {
                f: 5,
            },
        };

        const source = {
            a: [3, 4],
            b: {
                d: 3,
            },
            c: {
                e: 3,
            },
        };

        const result = await ObjectUtil.merge(target, source);

        expect(result).toStrictEqual({
            a: [1, 2, 3, 4],
            b: { d: 3, f: 5 },
            c: { e: 3 },
        });
    });
});

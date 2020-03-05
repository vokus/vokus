import { StringComponent } from '../index';

describe('StringComponent', () => {
    test('cast', () => {
        expect(StringComponent.cast(null)).toBe('null');
        expect(StringComponent.cast(undefined)).toBe('undefined');
        expect(StringComponent.cast({ t: 'test' })).toBe('{"t":"test"}');
        expect(StringComponent.cast([1, 2, 3, 4, {}])).toBe('[1,2,3,4,{}]');
        expect(StringComponent.cast(new Error('test'))).toBe('Error: test');
        expect(StringComponent.cast(new TypeError('test'))).toBe('TypeError: test');
        expect(StringComponent.cast('a string')).toBe('a string');
        expect(StringComponent.cast({ a: 'string' })).toBe('{"a":"string"}');

        const a: { [key: string]: any } = {};
        const b: { [key: string]: any } = {};

        a.b = b;
        b.a = a;

        expect(StringComponent.cast(a)).toBe('{"b":{}}');
    });
    test('camelize', () => {
        expect(StringComponent.camelize('camelized-string')).toBe('camelizedString');
        expect(StringComponent.camelize('camelized   string')).toBe('camelizedString');
        expect(StringComponent.camelize('super Camelized   string')).toBe('superCamelizedString');
        expect(StringComponent.camelize('super Camelized2   string')).toBe('superCamelized2String');
        expect(StringComponent.camelize('super_camelized_string')).toBe('superCamelizedString');
        expect(StringComponent.camelize('super.camelized.string')).toBe('superCamelizedString');
        expect(StringComponent.camelize('camelized')).toBe('camelized');
        expect(StringComponent.camelize('Camelized')).toBe('camelized');
    });
    test('decamelize', () => {
        expect(StringComponent.decamelize('camelized-string')).toBe('camelized-string');
        expect(StringComponent.decamelize('CamelizedString')).toBe('camelized-string');
        expect(StringComponent.decamelize('camelizedString')).toBe('camelized-string');
        expect(StringComponent.decamelize(' CamelizedString')).toBe('camelized-string');
        expect(StringComponent.decamelize(' camelized   String')).toBe('camelized-string');
        expect(StringComponent.decamelize('1CamelizedString')).toBe('1-camelized-string');
    });
});

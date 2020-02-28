import StringUtil from './string.util';

test('cast', () => {
    expect(StringUtil.cast(null)).toBe('null');
    expect(StringUtil.cast(undefined)).toBe('undefined');
    expect(StringUtil.cast({ t: 'test' })).toBe('{"t":"test"}');
    expect(StringUtil.cast([1, 2, 3, 4, {}])).toBe('[1,2,3,4,{}]');
    expect(StringUtil.cast(new Error('test'))).toBe('Error: test');
    expect(StringUtil.cast(new TypeError('test'))).toBe('TypeError: test');
    expect(StringUtil.cast('a string')).toBe('a string');

    expect(StringUtil.cast({ a: 'string' })).toBe('{"a":"string"}');

    // TODO: optimize
    const a: { [key: string]: any } = {};
    const b: { [key: string]: any } = {};

    a.b = b;
    b.a = a;

    expect(StringUtil.cast(a)).toBe('{"b":{}}');
});
test('camelize', () => {
    expect(StringUtil.camelize('camelized-string')).toBe('camelizedString');
    expect(StringUtil.camelize('camelized   string')).toBe('camelizedString');
    expect(StringUtil.camelize('super Camelized   string')).toBe('superCamelizedString');
    expect(StringUtil.camelize('super Camelized2   string')).toBe('superCamelized2String');
    expect(StringUtil.camelize('super_camelized_string')).toBe('superCamelizedString');
    expect(StringUtil.camelize('super.camelized.string')).toBe('superCamelizedString');
    expect(StringUtil.camelize('camelized')).toBe('camelized');
    expect(StringUtil.camelize('Camelized')).toBe('camelized');
});
test('decamelize', () => {
    expect(StringUtil.decamelize('camelized-string')).toBe('camelized-string');
    expect(StringUtil.decamelize('CamelizedString')).toBe('camelized-string');
    expect(StringUtil.decamelize('camelizedString')).toBe('camelized-string');
    expect(StringUtil.decamelize(' CamelizedString')).toBe('camelized-string');
    expect(StringUtil.decamelize(' camelized   String')).toBe('camelized-string');
    expect(StringUtil.decamelize('1CamelizedString')).toBe('1-camelized-string');
});

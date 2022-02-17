import { StringUtil } from './string';

describe('string-util', () => {
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

    test('slugify', () => {
        expect(StringUtil.slugify('slugified-string')).toBe('slugified-string');
        expect(StringUtil.slugify('SlugString')).toBe('slug-string');
        expect(StringUtil.slugify('slugifiedString')).toBe('slugified-string');
        expect(StringUtil.slugify(' SlugifiedString')).toBe('slugified-string');
        expect(StringUtil.slugify(' slugified   String')).toBe('slugified-string');
        expect(StringUtil.slugify('1SlugifiedString')).toBe('1-slugified-string');
        expect(StringUtil.slugify('10!".?&12 slugifiéd   String ')).toBe('10-12-slugified-string');
    });
});

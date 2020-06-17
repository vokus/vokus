import { String } from '../index';

describe('String', () => {
    test('camelize', () => {
        expect(String.camelize('camelized-string')).toBe('camelizedString');
        expect(String.camelize('camelized   string')).toBe('camelizedString');
        expect(String.camelize('super Camelized   string')).toBe('superCamelizedString');
        expect(String.camelize('super Camelized2   string')).toBe('superCamelized2String');
        expect(String.camelize('super_camelized_string')).toBe('superCamelizedString');
        expect(String.camelize('super.camelized.string')).toBe('superCamelizedString');
        expect(String.camelize('camelized')).toBe('camelized');
        expect(String.camelize('Camelized')).toBe('camelized');
    });

    test('decamelize', () => {
        expect(String.decamelize('camelized-string')).toBe('camelized-string');
        expect(String.decamelize('CamelizedString')).toBe('camelized-string');
        expect(String.decamelize('camelizedString')).toBe('camelized-string');
        expect(String.decamelize(' CamelizedString')).toBe('camelized-string');
        expect(String.decamelize(' camelized   String')).toBe('camelized-string');
        expect(String.decamelize('1CamelizedString')).toBe('1-camelized-string');
    });

    test('slugify', () => {
        expect(String.slugify('slugified-string')).toBe('slugified-string');
        expect(String.slugify('SlugString')).toBe('slug-string');
        expect(String.slugify('slugifiedString')).toBe('slugified-string');
        expect(String.slugify(' SlugifiedString')).toBe('slugified-string');
        expect(String.slugify(' slugified   String')).toBe('slugified-string');
        expect(String.slugify('1SlugifiedString')).toBe('1-slugified-string');
        expect(String.slugify('10!".?&12 slugifiéd   String ')).toBe('10-12-slugified-string');
    });
});

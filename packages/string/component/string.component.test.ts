import { StringComponent } from '../index';

describe('StringComponent', () => {
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

    test('slugify', () => {
        expect(StringComponent.slugify('slugified-string')).toBe('slugified-string');
        expect(StringComponent.slugify('SlugString')).toBe('slug-string');
        expect(StringComponent.slugify('slugifiedString')).toBe('slugified-string');
        expect(StringComponent.slugify(' SlugifiedString')).toBe('slugified-string');
        expect(StringComponent.slugify(' slugified   String')).toBe('slugified-string');
        expect(StringComponent.slugify('1SlugifiedString')).toBe('1-slugified-string');
        expect(StringComponent.slugify('10!".?&12 slugifiéd   String ')).toBe('10-12-slugified-string');
    });
});

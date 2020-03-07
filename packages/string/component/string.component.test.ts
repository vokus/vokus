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
});

import defaultExport, { superclass, mixin } from './index';

describe('superclass', () => {
    test('is a function', () => {
        expect(superclass).toBeFunction();
    });
});

describe('mixin', () => {
    test('is a function', () => {
        expect(mixin).toBeFunction();
    });
});

describe('default export', () => {
    test('is a function', () => {
        expect(defaultExport).toBeFunction();
    });
    test('is superclass', () => {
        expect(defaultExport).toBe(superclass);
    });
});

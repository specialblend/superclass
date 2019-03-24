import { superclass, mixin } from './src';

describe('package exports', () => {
    test('superclass function', () => {
        expect(superclass).toBeFunction();
    });
    test('mixin function', () => {
        expect(mixin).toBeFunction();
    });
});

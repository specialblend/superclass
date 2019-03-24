const { superclass, mixin } = require('./index');

describe('package exports', () => {
    test('superclass function', () => {
        expect(superclass).toBeFunction();
    });
    test('mixin function', () => {
        expect(mixin).toBeFunction();
    });
});

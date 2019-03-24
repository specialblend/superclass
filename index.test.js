const { superclass, mixin } = require('./index');

test('package exports correctly', () => {
    expect(superclass).toBeFunction();
    expect(mixin).toBeFunction();
});

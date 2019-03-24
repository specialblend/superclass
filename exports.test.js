import moduleES, { superclass, mixin } from './dist/index.esm';
import { superclass as superclassCJS, mixin as mixinCJS } from './dist/index.cjs';
const { superclass: superclassUMD, mixin: mixinUMD } = require('./dist/index.umd');

test('exports expected functions', () => {
    expect(superclass).toBeFunction();
    expect(mixin).toBeFunction();
});

test('default export is superclass function', () => {
    expect(moduleES).toBeFunction();
    expect(moduleES).toBe(superclass);
});

test('CJS exports work as expected', () => {
    expect(superclassCJS).toBeFunction();
    expect(mixinCJS).toBeFunction();
});

test('UMB exports work as expected', () => {
    expect(superclassUMD).toBeFunction();
    expect(mixinUMD).toBeFunction();
});

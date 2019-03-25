import assert from 'assert';
import isConstructable from '@specialblend/is-constructable';
import { add, scanPrototype } from './common';

/**
 * create a Superclass from a parent class and provided sister classes
 * @param {Class} base: the base class to extend
 * @param types
 * @returns {Class}: the created defaultExport
 */
export const superclass = (base, ...types) => {
    assert(isConstructable(base), 'base must be constructable');
    const supertypes = [base, ...types];
    const subtype = class extends base {
        constructor(...props) {
            super(...props);
            for (const Supertype of supertypes.reverse()) {
                add(this, new Supertype(...props));
            }
        }
    };
    if (types.length) {
        for (const supertype of supertypes) {
            add(subtype.prototype, scanPrototype(supertype));
        }
    }
    return subtype;
};

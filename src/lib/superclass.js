import assert from 'assert';
import isConstructable from '@specialblend/is-constructable';
import { add } from './common';

/**
 * create a defaultExport from a parent class and provided sister classes
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
    for (const supertype of supertypes) {
        add(subtype.prototype, supertype);
    }
    return subtype;
};

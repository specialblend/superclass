import assert from 'assert';
import isConstructable from '@specialblend/is-constructable';
import { copyPrototype } from './common';

/**
 * create a defaultExport from a parent class and provided sister classes
 * @param {Class} base: the base class to extend
 * @param {Array<Class>} supertypes: the sister classes
 * @returns {Class}: the created defaultExport
 */
export const superclass = (base, ...supertypes) => {
    assert(isConstructable(base), 'base must be constructable');
    const subtype = class extends base {
        constructor(...props) {
            super(...props);
            const originalObj = Object.assign({}, this);
            const superprops = {};
            for (const Supertype of supertypes.reverse()) {
                Object.assign(superprops, new Supertype(...props));
            }
            Object.assign(this, superprops, originalObj);
        }
    };
    for (const supertype of supertypes.reverse()) {
        copyPrototype(subtype, supertype);
    }
    copyPrototype(subtype, base);
    return subtype;
};

import assert from 'assert';
import isConstructable from '@specialblend/is-constructable';

/**
 * Copy prototype from source  to target
 * @param target
 * @param source
 */
const copyPrototype = (target, source) => {
    for (const prop of Reflect.ownKeys(source.prototype)) {
        if (typeof prop === 'symbol' || !prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
            if (typeof target.prototype[prop] === 'undefined') {
                Object.assign(target.prototype, { [prop]: source.prototype[prop] });
            }
        }
    }
};

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
            for (const Supertype of supertypes.reverse()) {
                const obj = {};
                Object.assign(obj, new Supertype(...props), this);
                Object.assign(this, obj);
            }
        }
    };
    for (const supertype of supertypes) {
        copyPrototype(subtype, supertype);
    }
    return subtype;
};

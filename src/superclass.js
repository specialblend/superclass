import * as R from 'ramda';
import { PrettyError } from '@specialblend/pretty-error';
import util from 'util';

const copyPrototype = (target, source) => {
    for (const prop of Reflect.ownKeys(source.prototype)) {
        if (typeof prop === 'symbol' || !prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
            if (typeof target.prototype[prop] === 'undefined') {
                Object.assign(target.prototype, { [prop]: source.prototype[prop] });
            }
        }
    }
};

const matches = R.flip(R.ifElse(R.is(Function), R.is, R.equals));

/**
 * Superclass Symbol, used to identity Superclass
 * @type {symbol}
 * @private
 */
export const __superclass__ = Symbol('__superclass__');

export class SuperclassError extends PrettyError {}

/**
 * Assert provided object is equal to or instance of allowed types
 * @param provided
 * @param name
 * @param allowed
 * @returns {boolean}
 */
const assertType = (provided, name, ...allowed) => {
    if (R.any(matches(provided), allowed)) {
        return true;
    }
    throw new SuperclassError(`provided invalid type for ${name}:`, {
        allowed,
        provided,
    });
};

/**
 * create a subclass of provided base class whose constructor
 * will receive arguments transformed by provided transformer function
 * @param {Class} base: the base class to extend
 * @param {Function} transform: the transformer function
 * @returns {Class}: the created subclass
 */
export const mixin = (base, transform) => {
    assertType(base, `argument 1 of ${util.inspect(mixin)}`, Function);
    assertType(transform, `argument 2 of ${util.inspect(mixin)}`, Function, null, undefined);
    return class extends base {
        constructor(...props) {
            if (transform === null) {
                super();
                return;
            }
            if (typeof transform === 'undefined') {
                super(...props);
                return;
            }
            if (typeof transform === 'function') {
                const transformedProps = transform(...props);
                assertType(transformedProps, `result of calling ${util.inspect(transform)}`, Array);
                super(...transformedProps);
            }
        }
    };
};

/**
 * create a Superclass from a parent class and provided sister classes
 * @param {Class} base: the base class to extend
 * @param {Array<Class>} supertypes: the sister classes
 * @returns {Class}: the created Superclass
 */
export const superclass = (base, ...supertypes) => {
    assertType(base, `argument 1 of ${util.inspect(superclass)}`, Function);
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
    return Object.assign(subtype, { [__superclass__]: __superclass__ });
};

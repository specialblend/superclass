import { PrettyError } from '@specialblend/pretty-error';

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
 * Superclass Symbol, used to identity Superclass
 * @type {symbol}
 * @private
 */
export const __superclass__ = Symbol('__superclass__');

export class SuperclassError extends PrettyError {}

/**
 * create a subclass of provided base class whose constructor
 * will receive arguments transformed by provided transformer function
 * @param {Class} base: the base class to extend
 * @param {Function} transform: the transformer function
 * @returns {Class}: the created subclass
 */
export const mixin = (base, transform) => {
    if (typeof base !== 'function') {
        throw new SuperclassError('invalid base provided!', {
            message: 'argument 1 must be of type function',
            received: base,
            receivedType: typeof base,
        });
    }
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
                super(...transform(...props));
                return;
            }
            throw new SuperclassError('invalid map provided!', {
                message: 'argument 2 must be of type function, null or undefined',
                received: transform,
                receivedType: typeof map,
            });
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

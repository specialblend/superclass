import * as R from 'ramda';
import assert from 'assert';

/**
 * Assert provided object is equal to or instance of allowed types
 * @param obj
 * @param message
 * @param typePredicates
 */
export const assertTypes = (obj, message, typePredicates) => {
    if (R.anyPass(typePredicates)(obj)) {
        return;
    }
    assert.fail(message);
};

/**
 * Recursively scan the prototype of provided class
 * @param {Class} source
 * @returns {any}
 */
export const scanPrototype = R.memoizeWith(R.identity, source => {
    const target = {};
    if (typeof source.prototype === 'undefined') {
        return target;
    }
    for (const prop of Reflect.ownKeys(source.prototype)) {
        if (typeof prop === 'symbol' || !prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
            if (typeof target[prop] === 'undefined') {
                target[prop] = source.prototype[prop];
            }
        }
    }
    const original = Object.assign({}, target);
    return Object.assign({}, scanPrototype(Reflect.getPrototypeOf(source)), original);
});


export const copy = (target, source) => {
    const original = Object.assign({}, target);
    return Object.assign(target, scanPrototype(source), original);
};

/**
 * Copy prototype from source to target
 * @param target
 * @param source
 */
export const copyPrototype = (target, source) => {
    return copy(target.prototype, source);
};

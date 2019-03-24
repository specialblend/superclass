import assert from 'assert';
import is from '@sindresorhus/is/dist/index';
import isConstructable from '@specialblend/is-constructable';
import { assertTypes } from './common';

/**
 * create a subclass of provided base class whose constructor
 * will receive arguments transformed by provided transformer function
 * @param {Class} base: the base class to extend
 * @param {Function} transform: the transformer function
 * @returns {Class}: the created subclass
 */
export const mixin = (base, transform) => {
    assert(isConstructable(base), 'base must be constructable');
    assertTypes(transform, 'transformer must be Function, null or undefined', [is.function, is.nullOrUndefined]);
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
            const transformedProps = transform(...props);
            if (is.array(transformedProps)) {
                super(...transformedProps);
                return;
            }
            super(transformedProps);
        }
    };
};

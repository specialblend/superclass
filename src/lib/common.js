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

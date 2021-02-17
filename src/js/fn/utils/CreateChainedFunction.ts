import isFunction from 'lodash/isFunction';

export const createChainedFunction = (...funcs: any[]) => {
    return funcs
        .filter(f => (isFunction(f)))
        .reduce((acc, f) => {
            if (!isFunction(f)) {
                throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
            }

            if (acc === null) {
                return f;
            }

            return function chainedFunction(this: any, ...args: any[]) {
                acc.apply(this, args);
                f.apply(this, args);
            };
    }, null);
}
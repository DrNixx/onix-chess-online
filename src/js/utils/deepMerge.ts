import {IObject} from "./types";

type TAllKeys<T> = T extends any ? keyof T : never;

type TIndexValue<T, K extends PropertyKey, D = never> = T extends any
    ? K extends keyof T
        ? T[K]
        : D
    : never;

type TPartialKeys<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>> extends infer O
    ? { [P in keyof O]: O[P] }
    : never;

type TFunction = (...a: any[]) => any;

type TPrimitives =
    | string
    | number
    | boolean
    | bigint
    | symbol
    | Date
    | TFunction;

type TMerged<T> = [T] extends [Array<any>]
    ? { [K in keyof T]: TMerged<T[K]> }
    : [T] extends [TPrimitives]
        ? T
        : [T] extends [object]
            ? TPartialKeys<{ [K in TAllKeys<T>]: TMerged<TIndexValue<T, K>> }, never>
            : T;

// istanbul ignore next
const isObject = (obj: any) => {
    if (typeof obj === "object" && obj !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            const prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }

        return Object.prototype.toString.call(obj) === "[object Object]";
    }

    return false;
};

const merge = <T extends IObject[]>(...objects: T): TMerged<T[number]> =>
    objects.reduce((result, current) => {
        if (Array.isArray(current)) {
            throw new TypeError(
                "Arguments provided to deepMerge must be objects, not arrays.",
            );
        }

        Object.keys(current).forEach((key) => {
            if (["__proto__", "constructor", "prototype"].includes(key)) {
                return;
            }

            if (Array.isArray(result[key]) && Array.isArray(current[key])) {
                result[key] = merge.options.mergeArrays
                    ? merge.options.uniqueArrayItems
                        ? Array.from(
                            new Set((result[key] as unknown[]).concat(current[key])),
                        )
                        : [...result[key], ...current[key]]
                    : current[key];
            } else if (isObject(result[key]) && isObject(current[key])) {
                result[key] = merge(result[key] as IObject, current[key] as IObject);
            } else {
                if (!merge.options.extendMode || !result[key]) {
                    result[key] =
                        current[key] === undefined
                            ? merge.options.allowUndefinedOverrides
                                ? current[key]
                                : result[key]
                            : current[key];
                }
            }
        });

        return result;
    }, {}) as any;

interface IOptions {
    /**
     * Если указано значение true, то будет использовано первое значение,
     * в противном случае - последнее
     *
     * Default: `false`
     */
    extendMode: boolean;

    /**
     * Если указано значение true, значения, явно заданные как undefined, будут переопределять существующие значения,
     * хотя свойства, которые просто опущены, ни на что не повлияют.
     * Если установлено значение false, значения, явно указанные как undefined, не будут переопределять существующие значения.
     *
     * Default: `true`
     */
    allowUndefinedOverrides: boolean;

    /**
     * Если установлено значение true, содержимое массивов будет объединено.
     * Если установлено значение false, свойства массива будут полностью заменены, а не объединено их содержимое.
     *
     * Default: `true`
     */
    mergeArrays: boolean;

    /**
     * Если установлено значение true, это гарантирует отсутствие повторяющихся элементов массива.
     * Если установлено значение false, при объединении массивов будут разрешены дубликаты.
     *
     * Default: `true`
     */
    uniqueArrayItems: boolean;
}

const defaultOptions: IOptions = {
    extendMode: false,
    allowUndefinedOverrides: true,
    mergeArrays: true,
    uniqueArrayItems: true,
};

merge.options = defaultOptions;

merge.withOptions = <T extends IObject[]>(
    options: Partial<IOptions>,
    ...objects: T
) => {
    merge.options = {
        ...defaultOptions,
        ...options,
    };

    const result = merge(...objects);

    merge.options = defaultOptions;

    return result;
};

export default merge;
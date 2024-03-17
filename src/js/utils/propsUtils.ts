import deepMerge from "./deepMerge";
import {IObject} from "./types";

export type defaultOf<T extends IObject, K extends keyof T> = Required<Pick<T, K>>;
type withDefaults<T extends IObject, K extends keyof T> = Omit<T, K> & defaultOf<T, K>;

export const applyDefaults = <T extends IObject, K extends keyof T>(propsIn: T, defaultProps: defaultOf<T, K>): withDefaults<T, K> => {
    return  deepMerge.withOptions({extendMode: true}, propsIn, defaultProps) as any;
};
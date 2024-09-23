import {useMemo} from "react";

import {IObject} from "../utils/types";
import {applyDefaults, defaultOf} from "../utils/propsUtils";

export function useDefaults<T extends IObject, K extends keyof T>(propsIn: T, defaultProps: defaultOf<T, K>) {
    return useMemo(() => applyDefaults(propsIn, defaultProps), [propsIn, defaultProps]);
}

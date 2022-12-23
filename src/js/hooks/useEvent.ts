import { useCallback, useInsertionEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export function useEvent<T extends Function>(handler: T) {
    const handlerRef = useRef<T | null>(null);

    useInsertionEffect(() => {
        handlerRef.current = handler;
    });

    return useCallback((...args: any[]) => {
        const fn = handlerRef.current;
        return fn?.(...args);
    }, []);
}
import sri from "../common/sri";
import { OnixStorageEvent, OnixStorageHelper } from "./Types";

const builder = (storage: Storage): OnixStorageHelper => {
    const api = {
        get: (k: string) => storage.getItem(k),
        set: (k: string, v: string): void => storage.setItem(k, v),
        fire: (k: string, v?: string) => storage.setItem(k, JSON.stringify({
            sri,
            nonce: Math.random(), // ensure item changes
            value: v
        })),
        remove: (k: string) => storage.removeItem(k),
        make: (k: string) => ({
            get: (d: string) => api.get(k) ?? d,
            set: (v: any) => api.set(k, v),
            fire: (v?: string) => api.fire(k, v),
            remove: () => api.remove(k),
            listen: (f: (e: OnixStorageEvent) => void) => window.addEventListener('storage', e => {
                if (e.key !== k || e.storageArea !== storage || e.newValue === null) return;
                let parsed: OnixStorageEvent | null;
                try {
                    parsed = JSON.parse(e.newValue);
                } catch (_) {
                    return;
                }
                // check sri, because Safari fires events also in the original
                // document when there are multiple tabs
                if (parsed?.sri && parsed.sri !== sri) f(parsed);
            })
        }),
        makeObject: function makeObjectFunc<T>(k: string) {
            return {
                get: (d: T) => {
                    try {
                        const unparsed = api.get(k);
                        return unparsed ? JSON.parse(unparsed) : d;
                    } catch {
                        return d;
                    }
                },
                set: (v: T) => api.set(k, JSON.stringify(v)),
                fire: (v?: T) => api.fire(k, v ? JSON.stringify(v) : undefined),
                remove: () => api.remove(k),
                listen: (f: (e: OnixStorageEvent) => void) =>
                    window.addEventListener('storage', (e) => {
                        if (e.key !== k || e.storageArea !== storage || e.newValue === null) return;
                        let parsed: OnixStorageEvent | null;
                        try {
                            parsed = JSON.parse(e.newValue);
                        } catch {
                            return;
                        }
                        // check sri, because Safari fires events also in the original
                        // document when there are multiple tabs
                        if (parsed?.sri && parsed.sri !== sri) f(parsed);
                    }),
            };
        },
        makeBoolean: (k: string) => ({
            get: (d = false) => (api.get(k) ?? (d ? '1' : '0')) == '1',
            set: (v: boolean): void => api.set(k, v ? '1' : '0'),
            toggle: () => api.set(k, api.get(k) == '1' ? '0' : '1')
        })
    };

    return api;
};

export const storage = builder(window.localStorage);
export const tempStorage = builder(window.sessionStorage);

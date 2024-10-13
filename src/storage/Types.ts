export type OnixStorageEvent = {
    sri: string;
    nonce: number;
    value?: string;
};

export interface OnixBooleanStorage {
    get(d: boolean): boolean;
    set(v: boolean): void;
    toggle(): void;
}

export interface OnixObjectStorage<T> {
    get(d: T): T;
    set(v: T): void;
    remove(): void;
    listen(f: (e: OnixStorageEvent) => void): void;
    fire(v?: T): void;
}

export interface OnixStorage {
    get(d: string): string;
    set(v: any): void;
    remove(): void;
    listen(f: (e: OnixStorageEvent) => void): void;
    fire(v?: string): void;
}

export interface OnixStorageHelper {
    make(k: string): OnixStorage;
    makeBoolean(k: string): OnixBooleanStorage;
    makeObject<T>(k: string): OnixObjectStorage<T>;
    get(k: string): string | null;
    set(k: string, v: string): void;
    fire(k: string, v?: string): void;
    remove(k: string): void;
}
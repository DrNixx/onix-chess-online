export interface OnixStorageEvent {
    sri: string;
    nonce: number;
    value?: string;
} 

export interface OnixBooleanStorage {
    get(): boolean;
    set(v: boolean): void;
    toggle(): void;
}

export interface OnixStorage {
    get(): string | null;
    set(v: any): void;
    remove(): void;
    listen(f: (e: OnixStorageEvent) => void): void;
    fire(v?: string): void;
}

export interface OnixStorageHelper {
    make(k: string): OnixStorage;
    makeBoolean(k: string): OnixBooleanStorage;
    get(k: string): string | null;
    set(k: string, v: string): void;
    fire(k: string, v?: string): void;
    remove(k: string): void;
}
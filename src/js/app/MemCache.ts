
class TtlMemCacheEntry<K, V> {
    public value: V;
    public expires = Infinity;

    constructor(value: V, ttl: number) {
        this.value = value;
        this.expires = (ttl === Infinity) ? ttl : Date.now() + ttl;
    }

    public expired(now = Date.now()) {
        if (this.expires === Infinity) {
            return false;
        }

        return this.expires < now;
    }
}

export class MemCache<K, V> {
    private store: Map<K, TtlMemCacheEntry<K, V>>;

    public ttl = 5 * 60 * 1000;

    public stale = false;

    constructor() {
        this.store = new Map<K, TtlMemCacheEntry<K, V>>();
    }

    public delete(key :K) {
        return this.store.delete(key);
    }

    public has(key: K) {
        return this.store.has(key);
    }

    public get(key: K) {
        const item = this.store.get(key);
        if (item) {
            const expired = item.expired();

            if (expired) {
                this.delete(key);
            }

            if (expired && this.stale) {
                return item.value;
            }

            if (expired) {
                return null;
            }

            return item.value;
        }

        return null;
    }

    public set(key: K, value: V) {
        if (!key) {
            throw new Error('Argument "key" cannot be null or undefined');
        }

        if (!value) {
            throw new Error('Argument "value" cannot be null or undefined');
        }

        const entry = new TtlMemCacheEntry(value, this.ttl);
        this.store.set(key, entry);

        return value;
    }
}
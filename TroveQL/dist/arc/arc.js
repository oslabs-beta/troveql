"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveCache = void 0;
const CacheItem_1 = require("./CacheItem");
class TroveCache {
    constructor(size) {
        this.get = (query) => {
            switch (true) {
                case this.t1.has(query) || this.t2.has(query):
                    console.log('In Get Case I');
                    const cache = this.t1.has(query) ? this.t1 : this.t2;
                    const result = cache.get(query); //this may be an issue
                    cache.delete(query);
                    this.t2.set(query, result);
                    return {
                        result: result.value,
                        miss: false,
                    };
                    break;
                case this.b1.has(query):
                    console.log('In Get Case II');
                    return { result: '', miss: 'b1' };
                    break;
                case this.b2.has(query):
                    console.log('In Get Case III');
                    return { result: '', miss: 'b2' };
                    break;
                case !this.t1.has(query) &&
                    this.t2.has(query) &&
                    this.b1.has(query) &&
                    this.b2.has(query):
                    console.log('In Get Case III');
                    return { result: '', miss: 'miss' };
                    break;
            }
        };
        this.set = (res) => {
            const node = new CacheItem_1.CacheItem(res.result);
            switch (true) {
                case res.miss === 'b1':
                    console.log('In Set Case II');
                    this.adaptation(true);
                    this.replace(false);
                    this.t2.set(res.query, node);
                    break;
                case res.miss === 'b2':
                    console.log('In Set Case III');
                    this.adaptation(false);
                    this.replace(true);
                    this.t2.set(res.query, node);
                    break;
                case res.miss === 'miss':
                    console.log('In Set Case III');
                    const l1 = this.t1.size + this.t2.size;
                    switch (true) {
                        case l1 === this.capacity:
                            if (this.t1.size < this.capacity) {
                                this.evictLRU(this.b1);
                                this.replace(false); //check this
                            }
                            else {
                                this.evictLRU(this.t1);
                            }
                            break;
                        case l1 < this.capacity:
                            const totalSize = this.t1.size + this.b1.size + this.t2.size + this.b2.size;
                            if (totalSize >= this.capacity) {
                                if (totalSize === this.capacity * 2) {
                                    this.evictLRU(this.b2);
                                }
                                this.replace(false); //check this
                            }
                            break;
                    }
                    this.t1.set(res.query, node);
                    break;
            }
        };
        this.adaptation = (isB1) => {
            if (isB1) {
                const n = this.b1.size >= this.b2.size ? 1 : this.b2.size / this.b1.size;
                this.p = this.p + n;
            }
            else {
                const n = this.b2.size >= this.b1.size ? 1 : this.b1.size / this.b2.size;
                this.p = this.p - n;
            }
        };
        this.removeAll = () => {
            const caches = [this.t1, this.t2, this.b1, this.b2];
            caches.forEach((cache) => cache.clear());
        };
        this.capacity = size;
        this.p = 0.5;
        this.t1 = new Map();
        this.t2 = new Map();
        this.b1 = new Map();
        this.b2 = new Map();
    }
    evictLRU(cache) {
        const firstKey = cache.keys().next().value;
        // will the following line pass by ref? Do we need to make a shallow copy?
        const evicted = [firstKey, cache.get(firstKey)];
        cache.delete(firstKey);
        return evicted;
    }
    replace(foundInB2) {
        if (this.t1.size > 0 &&
            (this.t1.size > this.p || (foundInB2 && this.t1.size === this.p))) {
            let [key, cacheItem] = this.evictLRU(this.t1);
            this.b1.set(key, cacheItem);
        }
        else {
            let [key, cacheItem] = this.evictLRU(this.t2);
            this.b2.set(key, cacheItem);
        }
    }
}
exports.TroveCache = TroveCache;

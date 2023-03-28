"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.troveCache = void 0;
const cacheItem_1 = require("./cacheItem");
class troveCache {
    constructor(size) {
        //RETRIEVE ITEMS FROM THE CACHE
        this.get = (query) => {
            const cache = this.getCache(query);
            if (cache === undefined) {
                this.resizeCache('miss');
            }
            else if (cache === this.t1 || cache === this.t2) {
                const result = cache.get(query);
                //get item from T1 & promote it to T2
                if (cache === this.t1) {
                    this.t1.delete(query);
                    if (this.t2.size >= this.t2Size) {
                        //TODO: change to LFU evict when logic is build
                        this.evictLRU(this.t2);
                    }
                    result.hits++;
                    this.t2.set(query, result);
                }
                else {
                    //TODO: does anything else need to happen here?
                    this.t2.delete(query);
                    result.hits++;
                    this.t2.set(query, result);
                }
                return result.value;
            }
            else if (cache === this.b1 || cache === this.b2) {
                this.resizeCache(cache);
            }
            return false;
        };
        //ADD NEW ITEMS TO THE CACHE
        this.set = (query, result) => {
            const newItem = new cacheItem_1.CacheItem(result);
            if (this.t1.size >= this.t1Size) {
                this.evictLRU(this.t1);
            }
            console.log('add item to ');
            this.t1.set(query, newItem);
        };
        //DELETE ALL ITEMS FROM ALL GHOSTS AND CACHES
        this.deleteAll = (query) => {
            const caches = [this.t1, this.t2, this.b1, this.b2];
            caches.forEach((cache) => cache.clear());
        };
        this.t1 = new Map();
        this.t2 = new Map();
        this.b1 = new Map();
        this.b2 = new Map();
        this.capacity = size;
        this.p = 0.5;
        //is this the correct way to do this?
        this.t1Size = Math.floor(this.capacity * this.p);
        this.t2Size = this.capacity - this.t1Size;
        this.ghostSize = this.t1Size;
    }
    //HELPER METHODS
    getCache(query) {
        const caches = [this.t1, this.t2, this.b1, this.b2];
        for (let cache of caches) {
            if (cache.has(query))
                return cache;
        }
        return undefined;
    }
    evictLRU(cache) {
        const firstKey = cache.keys().next().value;
        if (cache === this.t1) {
            if (this.b1.size > this.ghostSize) {
                this.evictLRU(firstKey);
            }
            this.b1.set(firstKey, true);
        }
        else if (cache === this.t2) {
            if (this.b2.size >= this.ghostSize) {
                this.evictLRU(this.b2);
            }
            this.b2.set(firstKey, true);
        }
        cache.delete(firstKey);
    }
    //TODO: Write logic for LFU cache eviction
    evictLFU(cache) { }
    resizeCache(cache) {
        if (cache === this.b1 || cache === 'miss') {
            this.updatePValue(this.t1Size, this.t2Size);
        }
        if (cache === this.b2) {
            this.updatePValue(this.t2Size, this.t1Size);
        }
        while (this.t1.size > this.t1Size || this.t2.size > this.t2Size) {
            if (this.t1.size > this.t1Size) {
                this.evictLRU(this.t1);
            }
            else if (this.t2.size > this.t2Size) {
                this.evictLRU(this.t2);
            }
        }
    }
    updatePValue(growCacheSize, shrinkCacheSize) {
        console.log('updating P Value cache');
        if (shrinkCacheSize >= 1) {
            return;
        }
        shrinkCacheSize--;
        growCacheSize++;
        const min = Math.min(growCacheSize, shrinkCacheSize);
        const max = Math.max(growCacheSize, shrinkCacheSize);
        this.p = min / max;
    }
}
exports.troveCache = troveCache;

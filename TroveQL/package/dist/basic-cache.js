"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    constructor() {
        /* PRIVATE methods & data*/
        this.cache = new Map();
        //set by default to 0 >> clear cache will only run if val is greater that 0
        this.persistance = 0;
        //TODO:
        //--create method that iterates through the cache and deletes anything less than the persistance
        //--create method to update the persistance
        //--somehow figure out how to increment through the cache ever ? seconds and evict anything that is > than the persistance.
    }
    getPersistance() {
        if (this.persistance === 0) {
            return Number.MAX_SAFE_INTEGER;
        }
        return this.persistance;
    }
    /* PUBLIC methods & data*/
    //set:
    set(key, value) {
        if (key === undefined || value === undefined)
            return;
        const valPersistance = this.getPersistance();
        let newVal = { value: value, expireAt: valPersistance };
        this.cache.set(key, newVal);
    }
    //get
    get(key) {
        if (key === undefined)
            return undefined;
        if (this.cache.has(key)) {
            const item = this.cache.get(key);
            return item.value;
        }
        return undefined;
    }
    //delete
    delete(key) {
        this.cache.delete(key);
    }
}
exports.default = Cache;

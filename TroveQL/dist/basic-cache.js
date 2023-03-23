"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
class Cache {
    constructor(persistance) {
        this.persistance = persistance;
        /* PRIVATE methods & data*/ //updated to public so that they can be accessed outside of the class
        this.cache = new Map();
        this.getPersistance = () => {
            if (this.persistance === 0) {
                return Number.MAX_SAFE_INTEGER;
            }
            return this.persistance;
        };
        /* PUBLIC methods & data*/
        //set:
        this.set = (key, value) => {
            if (key === undefined || value === undefined)
                return;
            const valPersistance = this.getPersistance();
            let newVal = { value: value, expireAt: valPersistance };
            this.cache.set(key, newVal);
        };
        //get
        this.get = (key) => {
            if (key === undefined)
                return undefined;
            if (this.cache.has(key)) {
                const item = this.cache.get(key);
                return item.value;
            }
            return undefined;
        };
        //delete
        this.delete = (key) => {
            this.cache.delete(key);
        };
        this.persistance = persistance;
    }
}
exports.Cache = Cache;

"use strict";
// class Cache {
//   /* PRIVATE methods & data*/
//   private cache = new Map<string, { value: string; expireAt: number }>();
//   private clearCacheIntervalId: number | null = null;
//   private time = 0;
Object.defineProperty(exports, "__esModule", { value: true });
//   //delete
//   public delete(key: string): void {
//     this.cache.delete(key);
//   }
//   //set the length of time that cache persists
//   public setPersistence(time: number): void {
//     this.time = time;
//     if (this.time > 0 && !this.clearCacheIntervalId) {
//       this.clearCacheIntervalId = setInterval(
//         () => this.clearExpired(),
//         this.time
//       ) as unknown as number;
//     }
//   }
//   //clear expired items from the cache
//   private clearExpired(): void {
//     const now = Date.now();
//     for (const [key, item] of this.cache) {
//       if (item.expireAt < now) {
//         this.cache.delete(key);
//       }
//     }
//     if (this.cache.size === 0) {
//       clearInterval(this.clearCacheIntervalId!);
//       this.clearCacheIntervalId = null;
//     }
//   }
// }
class Cache {
    constructor() {
        /* PRIVATE methods & data*/
        this.cache = new Map();
        this.persistance = 0; //set by default to 20 seconds;
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

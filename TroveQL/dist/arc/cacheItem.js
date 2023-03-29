"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheItem = void 0;
class CacheItem {
    constructor(val) {
        this.value = val;
        this.hits = 0;
    }
}
exports.CacheItem = CacheItem;

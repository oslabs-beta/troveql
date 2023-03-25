"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ARC {
    constructor() {
        this.get = (query) => {
            return 'query';
        };
        this.t1 = new Map();
        this.t2 = new Map();
        this.b1 = new Map();
        this.b2 = new Map();
        this.cacheSize = 0;
        this.t1Hits = 0;
        this.t2Hits = 0;
        this.p = 0;
    }
}

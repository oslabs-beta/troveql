"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TroveCache {
    constructor(size) {
        this.capacity = size;
        this.p = 0.5;
        this.t1 = new Map();
        this.t2 = new Map();
        this.b1 = new Map();
        this.b2 = new Map();
    }
}

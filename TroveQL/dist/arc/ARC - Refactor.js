"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                    return { result: false, miss: 'b1' };
                    break;
                case this.b2.has(query):
                    console.log('In Get Case III');
                    return { result: false, miss: 'b2' };
                    break;
                case this.b2.has(query):
                    console.log('In Get Case III');
                    return { result: false, miss: 'miss' };
                    break;
            }
        };
        this.set = (res) => {
            switch (true) {
                case res.miss === 'b1':
                    console.log('In Set Case II');
                    break;
                case res.miss === 'b2':
                    console.log('In Set Case III');
                    break;
                case res.miss === 'miss':
                    console.log('In Set Case III');
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
        this.replace = (bool) => { };
        this.capacity = size;
        this.p = 0.5;
        this.t1 = new Map();
        this.t2 = new Map();
        this.b1 = new Map();
        this.b2 = new Map();
    }
}

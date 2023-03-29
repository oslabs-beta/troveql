import CacheItem from './cacheItem';

import { RequestBody, ItemType, CacheType, ResponseType } from './arcTypes';

class TroveCache {
  capacity: number;
  p: number;
  t1: CacheType;
  t2: CacheType;
  b1: CacheType;
  b2: CacheType;

  constructor(size: number) {
    this.capacity = size;
    this.p = 0.5;
    this.t1 = new Map();
    this.t2 = new Map();
    this.b1 = new Map();
    this.b2 = new Map();
  }

  get = (query: string): ResponseType => {
    switch (true) {
      case this.t1.has(query) || this.t2.has(query):
        console.log('In Get Case I');
        const cache = this.t1.has(query) ? this.t1 : this.t2;
        const result = cache.get(query) as ItemType; //this may be an issue
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

      case !this.t1.has(query) &&
        this.t2.has(query) &&
        this.b1.has(query) &&
        this.b2.has(query):
        console.log('In Get Case III');
        return { result: false, miss: 'miss' };
        break;
    }
  };

  set = (res: ResponseType) => {
    const node = new CacheItem(res.val);

    switch (true) {
      case res.miss === 'b1':
        console.log('In Set Case II');
        this.adaptation(true);
        this.replace(false);
        //add data to cache
        break;

      case res.miss === 'b2':
        console.log('In Set Case III');
        this.adaptation(false);
        this.replace(true);
        //add data to cache
        break;
      case res.miss === 'miss':
        console.log('In Set Case III');
        const l1: number = this.t1.size + this.t2.size;

        switch (true) {
          case l1 === this.capacity:
            if (this.t1.size < this.capacity) {
              //remove RRU
              //Replace
            } else {
              //remove LRU from this.t1
            }
            break;
          case l1 < this.capacity:
            const totalSize =
              this.t1.size + this.b1.size + this.t2.size + this.b2.size;
            if (totalSize >= this.capacity) {
              if (totalSize === this.capacity * 2) {
                //remove LRU in B2
              }
              this.replace(false);
            }
            break;
        }

        break;
    }
  };

  adaptation = (isB1: boolean) => {
    if (isB1) {
      const n: number =
        this.b1.size >= this.b2.size ? 1 : this.b2.size / this.b1.size;
      this.p = this.p + n;
    } else {
      const n: number =
        this.b2.size >= this.b1.size ? 1 : this.b1.size / this.b2.size;
      this.p = this.p - n;
    }
  };

  replace = (bool: boolean) => {};
}

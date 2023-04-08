import { CacheItem } from './cacheItem';

import { ItemType, CacheType, ResponseType, CacheSizeType } from './arcTypes';

export class TroveCache {
  capacity: number;
  p: number;
  t1: CacheType;
  t2: CacheType;
  b1: CacheType;
  b2: CacheType;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.p = 0.5;
    this.t1 = new Map();
    this.t2 = new Map();
    this.b1 = new Map();
    this.b2 = new Map();
  }

  public get = (query: string): ResponseType => {
    switch (true) {
      // if graphQL query is in t1 or t2 map obj // if yes 
        // check if it's in t1 or t2
        // either way, delete query key from cache and promote it to t2
      case this.t1.has(query) || this.t2.has(query):
        console.log('In Get Case I');
        // either t1 has query, assign cache as this.t1 
        // or t2 has query, assign cache as this.t2
        const cache = this.t1.has(query) ? this.t1 : this.t2;
        // return value from cache key and assign it to result
        const result = cache.get(query) as ItemType; //this may be an issue
        console.log('result in Case I - Get', result);
        // delete query key from cache to promote it to t2 (frequent cache)
        cache.delete(query);
        this.t2.set(query, result);

        return {
          // why result.value? and not just result?
          result: result.value,
          // successfully using cache so miss is false
          miss: false,
        };

      // if query is in b1 map obj
      case this.b1.has(query):
        console.log('In Get Case II');
        return { result: '', miss: 'b1' };
      
      // if query is in b2 map obj
      case this.b2.has(query):
        console.log('In Get Case III');
        return { result: '', miss: 'b2' };

      case !this.t1.has(query) &&
        !this.t2.has(query) &&
        !this.b1.has(query) &&
        !this.b2.has(query):
        console.log('In Get Case IV');
        return { result: '', miss: 'miss' };
    }
  };

  public set = (res: ResponseType) => {
    const node = new CacheItem(res.result);
    console.log('newNode in set', node);
    switch (true) {
      case res.miss === 'b1':
        console.log('In Set Case II');
        this.adaptation(true);
        this.b1.delete(res.query);
        this.replace(false);

        this.t2.set(res.query, node);
        break;

      case res.miss === 'b2':
        console.log('In Set Case III');
        this.adaptation(false);
        this.replace(true);
        this.b2.delete(res.query);
        this.t2.set(res.query, node);
        break;

      case res.miss === 'miss':
        console.log('In Set Case IV');

        const l1: number = this.t1.size + this.b1.size;

        switch (true) {
          case l1 === this.capacity:
            if (this.t1.size < this.capacity) {
              this.evictLRU(this.b1);
              this.replace(false); //check this
            } else {
              this.evictLRU(this.t1);
            }
            break;

          case l1 < this.capacity:
            const totalSize =
              this.t1.size + this.b1.size + this.t2.size + this.b2.size;
            if (totalSize >= this.capacity) {
              if (totalSize === this.capacity * 2) {
                this.evictLRU(this.b2);
              }
              this.replace(false);
            }
            break;
        }
        this.t1.set(res.query, node);
        break;
    }
  };

  private adaptation = (isB1: boolean) => {
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

  private evictLRU(cache: CacheType) {
    const firstKey = cache.keys().next().value;
    // will the following line pass by ref? Do we need to make a shallow copy?
    const evicted = firstKey;
    cache.delete(firstKey);
    return evicted;
  }

  private replace(foundInB2: boolean): void {
    if (
      this.t1.size > 0 &&
      (this.t1.size > this.p || (foundInB2 && this.t1.size === this.p))
    ) {
      let key = this.evictLRU(this.t1);
      this.b1.set(key, true);
    } else {
      let key = this.evictLRU(this.t2);
      this.b2.set(key, true);
    }
  }

  public removeAll = (): void => {
    const caches: CacheType[] = [this.t1, this.t2, this.b1, this.b2];
    caches.forEach((cache: CacheType) => cache.clear());
  };

  public removeOne = (key: string): void => {
    const caches: CacheType[] = [this.t1, this.t2];
    caches.forEach((cache: CacheType) => cache.delete(key));
  }

  public keys = (): string[] => {
    const caches: CacheType[] = [this.t1, this.t2];
    const keys: string[] = [];
    caches.forEach((cache: CacheType) => keys.push(...Array.from(cache.keys())))
    return keys;
  }

  public cacheSize = (): CacheSizeType => {
    return {
      t1: this.t1.size,
      t2: this.t2.size,
      b1: this.b1.size,
      b2: this.b2.size,
      p: this.p
    };
  };

  //forTesting
  public returnAll = (): void => {
    const caches: CacheType[] = [this.t1, this.t2, this.b1, this.b2];
    const cacheNames: string[] = ['t1', 't2', 'b1', 'b2'];
    for (let i = 0; i < caches.length; i++) {
      console.log(cacheNames[i], caches[i]);
    }
  };
}

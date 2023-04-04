import { CacheItem } from './cacheItem';

import {
  ItemType,
  CacheType,
  ResponseType,
  CacheSizeType,
} from './arcTypes';

export class TroveCache {
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

  public get = (query: string): ResponseType => {
    console.log('---arc get method query input: ', query);
    switch (true) {
      case this.t1.has(query) || this.t2.has(query):
        console.log('In Get Case I');
        const cache = this.t1.has(query) ? this.t1 : this.t2;
        const result = cache.get(query) as ItemType; //this may be an issue
        console.log('result in Case I - Get', result);
        cache.delete(query);
        this.t2.set(query, result);

        return {
          result: result.value,
          miss: false,
        };

      case this.b1.has(query):
        console.log('In Get Case II');
        return { result: '', miss: 'b1' };

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
        this.replace(false);

        this.t2.set(res.query, node);
        break;

      case res.miss === 'b2':
        console.log('In Set Case III');
        this.adaptation(false);
        this.replace(true);
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
              this.replace(false); //check this
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
    const evicted = [firstKey, cache.get(firstKey)];
    cache.delete(firstKey);
    return evicted;
  }

  private replace(foundInB2: boolean): void {
    if (
      this.t1.size > 0 &&
      (this.t1.size > this.p || (foundInB2 && this.t1.size === this.p))
    ) {
      let [key, cacheItem] = this.evictLRU(this.t1);
      this.b1.set(key, cacheItem);
    } else {
      let [key, cacheItem] = this.evictLRU(this.t2);
      this.b2.set(key, cacheItem);
    }
  }

  public removeAll = (): void => {
    const caches: CacheType[] = [this.t1, this.t2, this.b1, this.b2];
    caches.forEach((cache) => cache.clear());
  };

  public removeOne = (key: string): void => {
    const caches: CacheType[] = [this.t1, this.t2];
    caches.forEach((cache) => cache.delete(key));
  }

  public cacheSize = (): CacheSizeType => {
    return {
      t1: this.t1.size,
      t2: this.t2.size,
      b1: this.b1.size,
      b2: this.b2.size,
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

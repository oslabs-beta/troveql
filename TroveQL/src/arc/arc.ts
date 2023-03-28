import { CacheItem } from './CacheItem';

type ItemType = {
  value: string;
  hits: number;
};
//NEW SHAPE OF QUERY from Erika

// type Variables = {
//   [key: string]: string;
// };
// type RequestBody = {
//   query: string;
//   variables: Variables;
// };

type CacheClass = Map<string, ItemType>;
type GhostClass = Map<string, boolean>;

class TroveCache {
  t1: CacheClass;
  t2: CacheClass;
  b1: GhostClass;
  b2: GhostClass;
  capacity: number;
  p: number;
  t1Size: number;
  t2Size: number;
  ghostSize: number;

  constructor(size: number) {
    this.capacity = size;
    this.p = 0.5;
    this.t1 = new Map();
    this.t2 = new Map();
    this.b1 = new Map();
    this.b2 = new Map();
    //we need to remove this
    this.t1Size = Math.floor(this.capacity * this.p);
    this.t2Size = this.capacity - this.t1Size;
    this.ghostSize = this.t1Size;
  }

  // RETRIEVE ITEMS FROM THE CACHE
  public get = (query: string): string | boolean => {
    const cache = this.getCache(query);
    if (cache === undefined) {
      this.resizeCache('miss');
      return undefined;
    }
    if (cache === this.t1 || cache === this.t2) {
      const result: ItemType = cache.get(query);

      //get item from T1 & promote it to T2
      const isT1 = cache === this.t1;
      if (isT1) {
        this.t1.delete(query);
      } else {
        this.t2.delete(query);
      }
      //TODO: change to LFU evict when logic is build
      if (this.t2.size >= this.t2Size) {
        this.evictLRU(this.t2);
      }

      result.hits++;
      this.t2.set(query, result);
      return result.value;
    } else if (cache === this.b1 || cache === this.b2) {
      this.resizeCache(cache);
      return false;
    }
  };

  //ADD NEW ITEMS TO THE CACHE
  public set = (query: string, result: string): void => {
    const newItem = new CacheItem(result);
    if (this.t1.size >= this.t1Size) {
      this.evictLRU(this.t1);
    }
    this.t1.set(query, newItem);
  };

  //DELETE ALL ITEMS FROM ALL GHOSTS AND CACHES
  public deleteAll = (): void => {
    const caches = [this.t1, this.t2, this.b1, this.b2];
    caches.forEach((cache) => cache.clear());
  };

  //HELPER METHODS
  private getCache(query: string): CacheClass | GhostClass | undefined {
    const caches = [this.t1, this.t2, this.b1, this.b2];
    for (let cache of caches) {
      if (cache.has(query)) return cache;
    }
    return undefined;
  }

  private evictLRU(cache: CacheClass | GhostClass): void {
    const firstKey = cache.keys().next().value;
    let targetCache;
    if (cache === this.t1 || cache === this.t2) {
      targetCache = cache === this.t1 ? this.b1 : this.b2;
    }
    if (targetCache && targetCache.size >= this.ghostSize) {
      this.evictLRU(targetCache);
    }
    cache.delete(firstKey);
  }

  //TODO: Write logic for LFU cache eviction
  private evictLFU(cache: CacheClass | GhostClass): void {}

  private resizeCache(cache: GhostClass | 'miss'): void {
    const growCacheSize =
      cache === this.b1 || cache === 'miss' ? this.t1Size : this.t2Size;
    const targetCache =
      cache === this.b1 || cache === 'miss' ? this.t1 : this.t2;
    const shrinkCacheSize = targetCache === this.t1 ? this.t2Size : this.t1Size;

    this.updatePValue(growCacheSize, shrinkCacheSize);

    while (targetCache.size > growCacheSize) {
      this.evictLRU(targetCache);
    }
  }
  //update pValue Helper function for resizeCache()
  private updatePValue(growCacheSize: number, shrinkCacheSize: number): void {
    //rethink this to increment pValue by a percentage
    if (shrinkCacheSize <= 1) {
      throw new Error('Cache sizes cannot be zero or negative');
      return;
    }
    //this needs to be refactored
    shrinkCacheSize--;
    growCacheSize++;
    const [min, max] = [
      Math.min(growCacheSize, shrinkCacheSize),
      Math.max(growCacheSize, shrinkCacheSize),
    ];
    console.log(max, min);
    this.p = max / min;
  }
}

export { TroveCache };

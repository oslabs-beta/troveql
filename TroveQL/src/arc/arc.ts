import { CacheItem } from './cacheItem';

type ItemType = {
  value: string;
  hits: number;
};
type MapClass = Map<string, ItemType>;

class ARC<T> {
  t1: MapClass;
  t2: MapClass;
  b1: MapClass;
  b2: MapClass;
  cacheSize: number;
  t1Hits: number;
  t2Hits: number;
  p: number;

  constructor() {
    this.t1 = new Map();
    this.t2 = new Map();
    this.b1 = new Map();
    this.b2 = new Map();
    this.cacheSize = 0;
    this.t1Hits = 0;
    this.t2Hits = 0;
    this.p = 0;
  }

  public get = (query: string): string => {
    return 'query';
  };
}

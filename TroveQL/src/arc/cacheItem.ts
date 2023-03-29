class CacheItem {
  value: string;
  hits: number;

  constructor(val: string) {
    this.value = val;
    this.hits = 0;
  }
}

export { CacheItem };

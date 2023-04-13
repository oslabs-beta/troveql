// TESTS FOR CACHE
const exp = require('constants');
const { afterEach } = require('node:test');
const { TroveCache } = require('../dist/arc/arc.js');
const { CacheItem } = require('../dist/arc/cacheItem');

const result1 = new CacheItem('Result1');
const result2 = new CacheItem('Result2');
const result3 = new CacheItem('Result3');
const result4 = new CacheItem('Result4');
const result5 = new CacheItem('Result5');

describe('TroveCache', () => {
  let troveCache;

  beforeEach(() => {
    troveCache = new TroveCache(4);
  });

  afterEach(() => {
    troveCache.removeAll();
  });

  describe('get method tests', () => {
    it("returns { result: '', miss: 'miss' } when the cache is empty", () => {
      expect(troveCache.get('Query1')).toEqual({ result: '', miss: 'miss' });
    });

    it('returns the cached item value and sets it to the t1 cache partition when the query is found in t1', () => {
      troveCache.t1.set('Query1', result1);

      expect(troveCache.get('Query1')).toEqual({
        result: 'Result1',
        miss: false,
      });

      expect(troveCache.t2.get('Query1')).toEqual({
        hits: 0,
        value: 'Result1',
      });
    });
  });

  it('returns the cached item value and sets it to the t2 cache partition when the query is found in t1', () => {
    troveCache.t2.set('Query2', result2);
    expect(troveCache.get('Query2')).toEqual({
      result: 'Result2',
      miss: false,
    });

    expect(troveCache.t2.get('Query2')).toEqual({
      hits: 0,
      value: 'Result2',
    });
  });

  it("returns { result: '', miss: 'b1' } when the query is found in b1 but not in t1 ,t2 and b2", () => {
    troveCache.b1.set('Query3', 'false');
    expect(troveCache.get('Query3')).toEqual({ result: '', miss: 'b1' });
  });

  it("returns { result: '', miss: 'b2' } when the query is found in b2 but not in t1, t2, and b1", () => {
    troveCache.b2.set('Query4', 'false');
    expect(troveCache.get('Query4')).toEqual({ result: '', miss: 'b2' });
  });
});

describe('set method tests', () => {
  let troveCache;

  beforeEach(() => {
    troveCache = new TroveCache(4);
  });

  afterEach(() => {
    troveCache.removeAll();
  });

  it('adds a new item to the cache when the cache is not full', () => {
    const response1 = {
      query: 'Query1',
      result: 'Result1',
      miss: 'miss',
    };

    troveCache.set(response1);
    expect(troveCache.t1.get('Query1')).toEqual({ hits: 0, value: 'Result1' });
    expect(troveCache.t1.size).toBe(1);
  });

  it('adding an item with miss type b1 removes the item from b1 and adds it to t2', () => {
    troveCache.b1.set('Query1', true);

    troveCache.set({
      query: 'Query1',
      result: 'Result1',
      miss: 'b1',
    });

    expect(troveCache.b1.get('Query1')).toBe(undefined);
    expect(troveCache.t2.get('Query1')).toEqual({ value: 'Result1', hits: 0 });
  });

  it('adding an item with miss type b2 removes the item from b2 and adds it to t2', () => {
    troveCache.b2.set('Query1', true);

    troveCache.set({
      query: 'Query1',
      result: 'Result1',
      miss: 'b2',
    });

    expect(troveCache.b2.get('Query1')).toBe(undefined);
    expect(troveCache.t2.get('Query1')).toEqual({ value: 'Result1', hits: 0 });
  });

  it('adds a new item to the cache and replaces the LRU item in t1 when the capacity is full', () => {
    //add a single item to t2.
    troveCache.t2.set('Query5', result5);

    //add four items to t1.
    for (let i = 1; i <= 4; i++) {
      troveCache.set({
        query: `Query${i}`,
        result: `Result${i}`,
        miss: 'miss',
      });
    }

    expect(troveCache.b1.get('Query1')).toEqual(true);
  });

  //when the cache is at 2x c we need to evict something from t2
  it('adding an item to the cache when it is already at 2x the capacity evicts the lru item from b2', () => {
    //add two items to t1
    troveCache.t1.set('Query1', result1);
    //add two items to t2
    troveCache.t2.set('Query2', result2);
    troveCache.t2.set('Query3', result3);
    troveCache.t2.set('Query4', result4);
    //add two items to b1
    troveCache.b1.set('Query5', true);
    troveCache.b1.set('Query6', true);
    //add two items to b2
    troveCache.b2.set('Query7', true); // this one should be expelled
    troveCache.b2.set('Query8', true);

    //add a new item,
    troveCache.set({
      query: 'Query5',
      result: 'Result5',
      miss: 'miss',
    });

    //check that the lru item in t2 was evicted & the item was added to t1;
    expect(troveCache.t2.get('Query7')).toBe(undefined);
    expect(troveCache.t1.get('Query5')).toEqual({
      hits: 0,
      value: 'Result5',
    });
  });
});

//TESTS FOR CACHE
const { afterEach } = require('node:test');
const { TroveCache } = require('../dist/arc/arc.js');
const { CacheItem } = require('../dist/arc/cacheItem');

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
      const result1 = new CacheItem('Result1');
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
    const result2 = new CacheItem('Result2');
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

    expect(troveCache.t1.get('Query1')).toEqual({
      hits: 0,
      value: 'Result1',
    });
  });

  it('adds a new item to the cache and replaces the LRU item in t1 when t1 is full and t2 is not', () => {
    for (let i = 1; i <= 5; i++) {
      troveCache.set({
        query: `Query${i}`,
        result: `Result${i}`,
        miss: 'miss',
      });
    }
    console.log('_______TESTTSSS________');
    console.log(troveCache.t1);
    console.log(troveCache.b1);

    //TODO: YOU NEED TO ADD SOME TO T2 AND THEN ADD SOME MORE TO T1 to get items to evict to B1

    // expect(troveCache.get('Query1')).toEqual({ result: '', miss: 'b1' });
    // expect(troveCache.get('Query2')).toEqual(result2);
    // expect(troveCache.get('Query3')).toEqual(result3);
    // expect(troveCache.get('Query4')).toEqual(result4);
  });
});

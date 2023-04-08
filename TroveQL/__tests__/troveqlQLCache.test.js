// TESTS FOR TROVEQL SERVER MIDDLEWARE 
const { beforeEach, before } = require('node:test');
const { TroveQLCache } = require('../dist/TroveQLCache');
const { clear } = require('console');

// queryCache method

//troveMetrics method
describe('troveMetrics method', () => {
  const troveQL = new TroveQLCache(5, '', true);
  let clearCache;

  // beforeEach(() => {
  // })

  it('clears the cache', () => {
    clearCache = true;
    troveQL.cache.set({
      query: 'query', 
      result: 'result',
      miss: 'miss'
    })
    troveQL.troveMetrics({ body: { clearCache } }, { locals: {} }, () => {});

    expect(troveQL.cache.cacheSize().t1).toBe(0);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
    expect(troveQL.cache.cacheSize().b1).toBe(0);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
  })

  it('does not clear the cache', () => {
    clearCache = false;
    troveQL.cache.set({
      query: 'query', 
      result: 'result',
      miss: 'miss'
    })
    troveQL.troveMetrics({ body: { clearCache } }, { locals: {} }, () => {});

    expect(troveQL.cache.cacheSize().t1).toBe(1);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
    expect(troveQL.cache.cacheSize().b1).toBe(0);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
  })

  // describe('clearCache is truthy on the request body', () => {
  //   it('clears the cache', () => {
  //     expect(troveQL.cache.cacheSize().t1).toBe(0);
  //     expect(troveQL.cache.cacheSize().t2).toBe(0);
  //     expect(troveQL.cache.cacheSize().b1).toBe(0);
  //     expect(troveQL.cache.cacheSize().t2).toBe(0);
  //   })
  // })

  // describe('clearCache is falsy on the request body', () => {
  //   it('does not clear the cache', () => {
  //     expect(troveQL.cache.cacheSize().t1).toBe(1);
  //     expect(troveQL.cache.cacheSize().t2).toBe(0);
  //     expect(troveQL.cache.cacheSize().b1).toBe(0);
  //     expect(troveQL.cache.cacheSize().t2).toBe(0);
  //   })
  // })
})

// sendData method - the function simply invokes a fetch call to the TM API without any additional logic so there's nothing to test

// parseQuery method
describe('parseQuery method', () => {
  const troveQL = new TroveQLCache(5, '', true);

  describe('Query type', () => {
    it ('returns an object with the query operation and its object type', () => {
      const query = `query {
        movies {
          id
          title
        }
      }`;
      expect(troveQL.parseQuery(query).operation).toBe('query');
      expect(troveQL.parseQuery(query).objectType).toBe('movies');
    })
  })

  describe('Mutation type', () => {
    it ('returns an object with the mutation operation and its object type', () => {
      const query = `mutation CreateMovie($title: String) {
        createMovie(title: $title) {
          id
          title
        }
      }`;
      expect(troveQL.parseQuery(query).operation).toBe('mutation');
      expect(troveQL.parseQuery(query).objectType).toBe('createMovie');
    })
  })
});
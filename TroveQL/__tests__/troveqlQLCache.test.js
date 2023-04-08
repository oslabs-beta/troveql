// TESTS FOR TROVEQL SERVER MIDDLEWARE 
const { beforeEach, before } = require('node:test');
const { TroveQLCache } = require('../dist/TroveQLCache');
const { clear } = require('console');

// queryCache method
describe('queryCache method', () => {
  let troveQL;
  let mutations;
  let mockReq;
  let mockRes;

  // beforeEach(() => {
  // })

  describe('Query type', () => {
    troveQL = new TroveQLCache(5, '', true);
    mockReq = () => {
      const req = {
        body: {
          query: `query {
            movies {
              id
              title
            }
          }`,
          variables: { id: 10 },
        }
      };
      return req;
    };
    mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(200);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
  

    //throws an error if query is undefined
    it('throws an error if query is undefined', () => {

    });
    //check if we can access res.locals for cache hit?
    //check if a fetch is called on cache miss?
    //check the size of the cache on hit (same) or miss (+1)?
    //check if sendData method was invoked?
  })

  describe('Mutation type', () => {
    mutations = { 
      createMovie: 'movie',
      deleteMovie: 'movie'
    }
    troveQL = new TroveQLCache(5, '', true, mutations);
    mockReq = () => {
      const req = {
        body: {
          query: `mutation CreateMovie($title: String) {
            createMovie(title: $title) {
              id
              title
            }
          }`,
          variables: { title: 'newMovie' },
        }
      };
      return req;
    };
    
    //throws an error if query is undefined or not a valid graphQL query to parse
    //check if a fetch is called?
    //check that we delete something from the cache if it's in there (no matter if it's a add, update, or delete)
    //check that we remove all get ALL queries from the cache
    //check if sendData method was invoked?
  })
});

//troveMetrics method
describe('troveMetrics method', () => {
  const troveQL = new TroveQLCache(5, '', true);
  let clearCache;

  // beforeEach(() => {
  // })

  it('clears the cache if clearCache is truthy on the request body', () => {
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

  it('does not clear the cache if clearCache is falsy on the request body', () => {
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
});

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
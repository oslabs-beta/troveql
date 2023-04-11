// TESTS FOR TROVEQL SERVER MIDDLEWARE 
const { beforeEach, before } = require('node:test');
const { TroveQLCache } = require('../dist/TroveQLCache');

// queryCache method
describe('queryCache method', () => {
  let troveQL;

  beforeEach(() => {
    troveQL = new TroveQLCache(5, '', true);
  })

  describe('Query type', () => {
    const mockReq = () => ({
      body: {
        query: `query {
          movies {
            id
            title
          }
        }`,
        variables: { id: 10 },
      }
    });
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const mockNext = () => {
      const next = jest.fn();
      return next;
    }
    //throws an error if query is undefined
    it('throws an error if query is undefined', async () => {
      const mockedReq = mockReq();
      const mockedRes = mockRes();
      const mockedNext = mockNext();
      const mockEntries = {
        data: {}
      };

      await troveQL.queryCache(mockedReq, mockedRes, mockedNext);
      expect(mockedRes.status).toHaveBeenCalledWith(200);
      expect(next).toHaveBeenCalled();
    });
    //check if we can access res.locals for cache hit?
    //check if a fetch is called on cache miss?
    //check the size of the cache on hit (same) or miss (+1)?
    //check if sendData method was invoked?
  })

  describe('Mutation type', () => {
    const mutations = { 
      createMovie: 'movie',
      deleteMovie: 'movie'
    }
    troveQL = new TroveQLCache(5, '', true, mutations);
    const mockReq = () => {
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
    const mockRes = () => {};
    //throws an error if query is undefined or not a valid graphQL query to parse
    //check if a fetch is called?
    //check that we delete something from the cache if it's in there (no matter if it's a add, update, or delete)
    //check that we remove all get ALL queries from the cache
    //check if sendData method was invoked?
  })
});

//troveMetrics method
describe('troveMetrics method', () => {

  it('clears the cache if clearCache is truthy on the request body', () => {
    const troveQL = new TroveQLCache(5, '', true);
    troveQL.cache.set({
      query: 'query', 
      result: 'result',
      miss: 'miss'
    })
    const clearCache = true;
    troveQL.troveMetrics({ body: { clearCache } }, { locals: {} }, () => {});

    expect(troveQL.cache.cacheSize().t1).toBe(0);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
    expect(troveQL.cache.cacheSize().b1).toBe(0);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
  })

  it('does not clear the cache if clearCache is falsy on the request body', () => {
    const troveQL = new TroveQLCache(5, '', true);
    troveQL.cache.set({
      query: 'query', 
      result: 'result',
      miss: 'miss'
    })
    const clearCache = false;
    troveQL.troveMetrics({ body: { clearCache } }, { locals: {} }, () => {});
    console.log(troveQL.cache);

    expect(troveQL.cache.cacheSize().t1).toBe(1);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
    expect(troveQL.cache.cacheSize().b1).toBe(0);
    expect(troveQL.cache.cacheSize().t2).toBe(0);
  })
});

// sendData method - the function simply invokes a fetch call to the TM API without any additional logic so there's nothing to test

// parseQuery method
describe('parseQuery method', () => {
  let troveQL;

  beforeAll(() => {
    troveQL = new TroveQLCache(5, '', true);
  })

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
});
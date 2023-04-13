// TESTS FOR TROVEQL SERVER MIDDLEWARE 
const { TroveQLCache } = require('../dist/TroveQLCache');

// queryCache method
describe('queryCache method', () => {
  let troveQL;
  const mockReq = (query, variables) => ({
    body: {
      query,
      variables
    }
  });
  const mockRes = () => ({
    locals: {},
    json: jest.fn()
  })
  const mockNext = () => {
    const next = jest.fn();
    return next;
  }

  beforeEach(() => {
    troveQL = new TroveQLCache(5, '');
    troveQL.cache.set({
      query: 'movies', 
      result: 'allMovies',
      miss: 'miss'
    })
  })

  it('returns the query result from the cache on a cache HIT', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve('')
    }));
    const query = `query {
      movies {
        id
        title
      }
    }`;
    const mockedReq = mockReq(query);
    const mockedRes = mockRes();
    const mockedNext = mockNext();

    await troveQL.queryCache(mockedReq, mockedRes, mockedNext);
    expect(fetch).toBeCalledTimes(0);
    expect(mockedRes.locals.value).toEqual('allMovies');
    expect(mockedNext).toBeCalledTimes(1);
  })

  it('returns the query result from the GraphQL API on a cache MISS', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve('newMovie')
    }));
   const query = `query ($id: ID) {
      movie(id: $id) {
          id
          title
      }
    }`;
    const variables = { id: 10 };
    const mockedReq = mockReq(query, variables);
    const mockedRes = mockRes();
    const mockedNext = mockNext();

    await troveQL.queryCache(mockedReq, mockedRes, mockedNext);
    // we can only check if the fetch is called (and not the logic within the fetch) because we are using the mock function that simply resolves a Promise to 'newMovie'
    expect(fetch).toBeCalledTimes(1);
  })

  it('sends data to TroveMetrics if useTroveMetrics is TRUE', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve('dataReceived')
    }));
    const troveQL = new TroveQLCache(5, '', true);
    troveQL.cache.set({
      query: 'movies', 
      result: 'allMovies',
      miss: 'miss'
    })
    const query = `query {
      movies {
        id
        title
      }
    }`;
    const mockedReq = mockReq(query);
    const mockedRes = mockRes();
    const mockedNext = mockNext();

    await troveQL.queryCache(mockedReq, mockedRes, mockedNext);
    expect(fetch).toBeCalledTimes(1);
  });
});

// parseQuery method
describe('parseQuery method', () => {
  let troveQL;

  beforeAll(() => {
    troveQL = new TroveQLCache(5, '');
  })

  it ('returns an object with the query operation and its object type', () => {
    const query = `query {
      movies {
        id
        title
      }
    }`;
    expect(troveQL.parseQuery(query).operation).toEqual('query');
    expect(troveQL.parseQuery(query).objectType).toEqual('movies');
  })

  it ('returns an object with the mutation operation and its object type', () => {
    const query = `mutation CreateMovie($title: String) {
      createMovie(title: $title) {
        id
        title
      }
    }`;
    expect(troveQL.parseQuery(query).operation).toEqual('mutation');
    expect(troveQL.parseQuery(query).objectType).toEqual('createMovie');
  })
});

// troveMetrics method
describe('troveMetrics method', () => {
  let troveQL;
  const mockReq = (clearCache) => ({
    body: {
      clearCache
    }
  });
  const mockRes = () => ({
    locals: {},
    json: jest.fn()
  })
  const mockNext = () => {
    const next = jest.fn();
    return next;
  }

  beforeEach(() => {
    troveQL = new TroveQLCache(5, '');
    troveQL.cache.set({
      query: 'movies', 
      result: 'allMovies',
      miss: 'miss'
    })
  })

  it('does not clear the cache if clearCache is falsy on the request body', () => {
    const mockedReq = mockReq(false);
    const mockedRes = mockRes();
    const mockedNext = mockNext();
    troveQL.troveMetrics(mockedReq, mockedRes, mockedNext);

    expect(troveQL.cache.cacheSize().t1).toEqual(1);
    expect(troveQL.cache.cacheSize().t2).toEqual(0);
    expect(troveQL.cache.cacheSize().b1).toEqual(0);
    expect(troveQL.cache.cacheSize().t2).toEqual(0);
    expect(mockedRes.locals.message).toEqual(undefined);
    expect(mockedNext).toBeCalledTimes(1);
  })

  it('clears the cache if clearCache is truthy on the request body', () => {
    const mockedReq = mockReq(true);
    const mockedRes = mockRes();
    const mockedNext = mockNext();
    troveQL.troveMetrics(mockedReq, mockedRes, mockedNext);

    expect(troveQL.cache.cacheSize().t1).toEqual(0);
    expect(troveQL.cache.cacheSize().t2).toEqual(0);
    expect(troveQL.cache.cacheSize().b1).toEqual(0);
    expect(troveQL.cache.cacheSize().t2).toEqual(0);
    expect(mockedRes.locals.message).toEqual({ cacheEmpty: true });
    expect(mockedNext).toBeCalledTimes(1);
  })
});
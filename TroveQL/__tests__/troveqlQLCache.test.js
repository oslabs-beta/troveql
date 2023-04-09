// TESTS FOR TROVEQL SERVER MIDDLEWARE 
const { TroveQLCache } = require('../dist/TroveQLCache');

describe('TroveQL Middleware', () => {
  let troveQL;

  beforeEach(() => {
    troveQL = new TroveQLCache(5, 'http://localhost:4000/graphql', true);
  })


  // Test suite for queryCache 
  describe('queryCache', () => {

  });


  // Test suite for troveMetrics
    // if req.body.clearCache is true
    // expect res.locals.message to be {cacheEmpty: true}
  describe('troveMetrics', () => {

  });


  // Test suite for sendData
    // Mock api calls
    // check if data passed in is valid
    // check if response comes back is success
    // check if error is handled correctly if respone failed to come back
  describe('sendData', () => {
    // Mock api call
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({status: 'success'}),
      })
    });

    // Reset mock API call after each test case
    afterEach(() => {
      jest.restoreAllMocks();
    })

    it ('sends the expected data to the server', async () => {
      // Check example body
      const cacheHit = true;
      const query = 'query { movies { id title } }';
      const variables = { id: 10 };
      const cacheSize = { t1: 4, t2: 1, b1: 0, b2: 0, p: 0.5 };
      const queryTime = 2;
      const size = 5;

      await troveQL.sendData(cacheHit, query, variables, cacheSize, queryTime, size);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cacheHit,
          query,
          variables,
          cacheSize,
          queryTime,
          size,
        }),
      });
    })
  });


  // Test suite for parseQuery
  describe('parseQuery', () => {
    it('returns query if the query is a query string', () => {
      const query = `query {
          movies {
            id
            title
          }
        }`;
      expect(troveQL.parseQuery(query)).toEqual('query');
    }); 

    it('returns mutation if the query is a mutation string', () => {
      const query = `mutation CreateMovie($title: String) {
        createMovie(title: $title) {
          id
          title
        }
      }`;
      expect(troveQL.parseQuery(query)).toEqual('mutation');
    }); 
    
    // it('throws an error if the query is not a query or mutation string', () => {
    //   const invalidQuery = `subscription {
    //     movieAdded {
    //       id
    //       title
    //     }
    //   }`;
    //   expect(() => troveQL.parseQuery(invalidQuery)).toThrow('Invalid query type');
    // });
  });

});
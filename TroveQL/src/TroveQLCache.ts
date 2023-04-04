import { TroveCache } from './arc/arc';
import { parse, DocumentNode } from 'graphql';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Variables } from './types';
import { ResponseType, CacheSizeType } from './arc/arcTypes';

//up next: invoke global error handler in the user's Node/Express server if there is an error - but how do we know what shape it will look like?

// Build troveQLCache library 

class TroveQLCache {
  // Create troveQLCache constructor // args: size: ?, graphAPI:, boolean to useTroveMetrics
  // Shape of each troveQLCache instance
  // {
    // cache: new instance of TroveCache passing in arg size,
    // graphQLAPI: arg graphAPI,
    // useTroveMetrics: arg boolean (false by default) 
  // }
  cache: TroveCache;
  size: number;
  constructor(size: number, public graphQLAPI: string, public useTroveMetrics: boolean = false) {
    this.cache = new TroveCache(size);
    this.graphQLAPI = graphQLAPI;
    this.useTroveMetrics = useTroveMetrics;
    this.size = size;
  }

  // GOAL: Check if query coming from end user is in TroveCache or not
    // if operations is query, use get method to check if query is in cache as key
      // if query is in cache, store it in res.locals
        // if user wants to use our metric app, send data to metrics app
      // if query is not in cache, use fetch method to send cache  user's graphAPI endpoint
      // save data comes back to cache in the following shape by using cache.set in object
      // {
      //   query: cacheKey,
      //   result: data,
      //   miss: money.miss,
      // }
  queryCache: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const operation: string = this.parseQuery(req.body.query);
    const query: string = req.body.query;
    const variables: Variables = req.body.variables;
    // Whole req.body incl query and variables
    const cacheKey: string = JSON.stringify(req.body);

    console.log('size', this.size);
    // If operation is query 
    if (operation === 'query') {
      // pass cache key to get method of troveCache
      // assign money as the returned object from invoking this.cache.get()
      // possible money per case
        // {
        // result: result.value or '', 
        // miss: boolean, 'b1' or 'b2', 'miss',
        // }
      const money: ResponseType = this.cache.get(cacheKey);

      // not necessarily boolean ?
      const cacheHit: boolean = money.miss ? false : true;
      // console.log('>>>show me the money: ', money);

      // if true, save result to res.locals as value
      if (cacheHit) {
        // console.log('>>>$$$ cache money $$$');
        res.locals.value = money.result;

        // if user wants to use TroveMetrics
        if (this.useTroveMetrics) {
          this.sendData(cacheHit, query, variables, this.cache.cacheSize(), this.size);
        }

        // prints everything in the cache - delete
        console.log('>>>Updated cache in the bank:');
        this.cache.returnAll();
        
        return next();
      } else {
        fetch(this.graphQLAPI, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: cacheKey,
        })
          .then((r) => r.json())
          .then((data) => {
            console.log('>>>data from /graphql api: ', data);
            console.log('>>>about to set the cache key: ', cacheKey);
            res.locals.value = data;
            const cacheValue: ResponseType = {
              query: cacheKey,
              result: data,
              miss: money.miss,
            };
            this.cache.set(cacheValue);
            
            if (this.useTroveMetrics) {
              this.sendData(cacheHit, query, variables, this.cache.cacheSize(), this.size);
            }

            // prints everything in the cache - delete
            console.log('>>>Updated cache in the bank:');
            this.cache.returnAll();

            return next();
          })
          .catch(error => console.log(error));
      }
    }
    
    if (operation === 'mutation') {
      console.log('>>>in the mutation if statement of the TroveQL middleware');
      fetch(this.graphQLAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: cacheKey,
      })
      .then(r => r.json())
      .then((data) => {
        res.locals.value = data;
        this.cache.removeAll();

        if (this.useTroveMetrics) {
          this.sendData();
        }

        // prints everything in the cache - delete
        console.log('>>>Updated cache in the bank:');
        this.cache.returnAll();

        return next();
      })
      .catch(error => console.log(error));
    }
  };

  // Method or middleware for troveMetrics to clear all caches if end user clicks Clear Metrics button
  troveMetrics: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    // if clearCache (in req.body from troveMetrics) is true 
    if (req.body.clearCache) {
      this.cache.removeAll();
      res.locals.message = { cacheEmpty: true };
    }
    return next();
  }

  // send data to localhost 3333 where troveMetrics server is listening to
  sendData = (cacheHit?: boolean, query?: string, variables?: Variables, cacheSize?: CacheSizeType, size?: number): void => {
    fetch('http://localhost:3333/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cacheHit,
        query,
        variables,
        cacheSize,
        size,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  // Helper method to parse query using graphQL library's built-in method 'parse'
    // i: graphQL query string
    // o: operations (either 'query' or 'mutation')
  parseQuery = (query: string): string => {
    // parse graphQL string
    const parsedQuery: DocumentNode = parse(query);
    // declare variable operations and assign it with 'query' or 'mutation' from parsedQuery
    const operation: string = parsedQuery['definitions'][0].operation;
    return operation;
  };
}

export { TroveQLCache };

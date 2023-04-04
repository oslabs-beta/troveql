import { TroveCache } from './arc/arc';
import { parse, DocumentNode } from 'graphql';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Variables } from './types';
import { ResponseType, CacheSizeType } from './arc/arcTypes';

class TroveQLCache {
  // pass TroveQLCache the size of the cache to use, the graphQL API to query, and if you would like to use TroveMetrics
  cache: TroveCache;
  size: number;
  constructor(size: number, public graphQLAPI: string, public useTroveMetrics: boolean = false) {
    this.cache = new TroveCache(size);
    this.graphQLAPI = graphQLAPI;
    this.useTroveMetrics = useTroveMetrics;
    this.size = size;
  }

  // queryCache is the Express middleware that parses the incoming GraphQL API query and gets/sets the cache
  queryCache: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const startTime: number = this.useTroveMetrics ? Date.now() : null;
    const operation: string = this.parseQuery(req.body.query);
    const query: string = req.body.query;
    const variables: Variables = req.body.variables;
    // Whole req.body incl query and variables
    const cacheKey: string = JSON.stringify(req.body);

    // if the query is a 'Query' type
    if (operation === 'query') {
      // get from the cache
      const money: ResponseType = this.cache.get(cacheKey);

      // not necessarily boolean ?
      const cacheHit: boolean = money.miss ? false : true;
      // console.log('>>>show me the money: ', money);

      // if the query result is in the cache then return it
      if (cacheHit) {
        // console.log('>>>$$$ cache money $$$');
        res.locals.value = money.result;

        // if user wants to use TroveMetrics
        if (this.useTroveMetrics) {
          const finishTime = Date.now();
          this.sendData(cacheHit, query, variables, this.cache.cacheSize(), finishTime - startTime);
        }

        // prints everything in the cache - delete
        console.log('>>>Updated cache in the bank:');
        this.cache.returnAll();
        
        return next();

      // if the query result is NOT in the cache then fetch from the graphQL API and then add the query result to the cache
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
              const finishTime = Date.now();
              this.sendData(cacheHit, query, variables, this.cache.cacheSize(), finishTime - startTime, this.size);
            }

            // prints everything in the cache - delete
            console.log('>>>Updated cache in the bank:');
            this.cache.returnAll();

            return next();
          })
          .catch(error => console.log(error));
      }
    }
    
    // if the query is a 'Mutation' type
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

  // troveMetrics is another Express middleware that clears the cache on requests from TM
  troveMetrics: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    // if clearCache (in req.body from troveMetrics) is true 
    if (req.body.clearCache) {
      this.cache.removeAll();
      res.locals.message = { cacheEmpty: true };
    }
    return next();
  }

  // sendData to TroveMetrics
  // send data to localhost 3333 where troveMetrics server is listening to
  sendData = (cacheHit?: boolean, query?: string, variables?: Variables, cacheSize?: CacheSizeType, queryTime?: number, size?: number): void => {
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
        queryTime,
        size,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  // parseQuery checks if the graphQL API query is a query or a mutation type
  parseQuery = (query: string): string => {
    // parse graphQL string
    const parsedQuery: DocumentNode = parse(query);
    // declare variable operations and assign it with 'query' or 'mutation' from parsedQuery
    const operation: string = parsedQuery['definitions'][0].operation;
    return operation;
  };
}

export { TroveQLCache };

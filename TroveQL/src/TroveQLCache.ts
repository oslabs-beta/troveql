import { TroveCache } from './arc/arc';
import { parse, DocumentNode } from 'graphql';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Variables } from './types';
import { ResponseType, CacheSizeType } from './arc/arcTypes';

//up next: invoke global error handler in the user's Node/Express server if there is an error - but how do we know what shape it will look like?

class TroveQLCache {
  cache: TroveCache;
  constructor(size: number, public graphQLAPI: string, public useTroveMetrics: boolean = false) {
    this.cache = new TroveCache(size);
    this.graphQLAPI = graphQLAPI;
    this.useTroveMetrics = useTroveMetrics;
  }

  queryCache: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const operation: string = this.parseQuery(req.body.query);
    const query: string = req.body.query;
    const variables: Variables = req.body.variables;
    const cacheKey: string = JSON.stringify(req.body);

    if (operation === 'query') {
      const money: ResponseType = this.cache.get(cacheKey);
      const cacheHit: boolean = money.miss ? false : true;
      console.log('>>>show me the money: ', money);

      if (cacheHit) {
        console.log('>>>$$$ cache money $$$');
        res.locals.value = money.result;

        if (this.useTroveMetrics) {
          this.sendData(cacheHit, query, variables, this.cache.cacheSize());
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
              this.sendData(cacheHit, query, variables, this.cache.cacheSize());
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

  troveMetrics: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (req.body.clearCache) {
      this.cache.removeAll();
      res.locals.message = { cacheEmpty: true };
    }
    return next();
  }

  sendData = (cacheHit?: boolean, query?: string, variables?: Variables, cacheSize?: CacheSizeType): void => {
    fetch('http://localhost:3333/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cacheHit,
        query,
        variables,
        cacheSize
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  parseQuery = (query: string): string => {
    const parsedQuery: DocumentNode = parse(query);
    const operation: string = parsedQuery['definitions'][0].operation;
    return operation;
  };
}

export { TroveQLCache };

// test npmignore
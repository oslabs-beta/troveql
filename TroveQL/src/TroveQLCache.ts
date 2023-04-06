import { TroveCache } from './arc/arc';
import { parse, DocumentNode } from 'graphql';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Variables, QueryInfo } from './types';
import { ResponseType, CacheSizeType } from './arc/arcTypes';

class TroveQLCache {
  // pass TroveQLCache the size of the cache to use, the graphQL API to query, if you would like to use TroveMetrics, and an object with the names of your graphQL API's Mutation types and the object types they mutate (if applicable)
  cache: TroveCache;
  constructor(size: number, public graphQLAPI: string, public useTroveMetrics: boolean = false, public mutations?: Variables) {
    this.cache = new TroveCache(size);
    this.graphQLAPI = graphQLAPI;
    this.useTroveMetrics = useTroveMetrics;
    this.mutations = mutations;
  }

  // queryCache is the Express middleware that parses the incoming GraphQL API query and gets/sets the cache
  queryCache: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const startTime: number = this.useTroveMetrics ? Date.now() : null;
    const query: string = req.body.query;
    const variables: Variables = req.body.variables;
    console.log('>>>query: ', query);
    console.log('>>>variables: ', variables);

    const { operation, objectType, objectFields }: QueryInfo = this.parseQuery(req.body.query);
    // normalize the cache key - assumptions: 
    // (1) queries always return the id of the object as a field
    // (2) queries only have 0 or 1 arguments (id) - can iterate on this
    let cacheKey: string = variables ? (objectType + '_' + variables.id) : objectType;
    console.log('>>>operation: ', operation);
    console.log('>>>objectType: ', objectType);

    // if the query is a 'Query' type
    if (operation === 'query') {
      // get from the cache
      const money: ResponseType = this.cache.get(cacheKey);

      const cacheHit: boolean = money.miss ? false : true;
      // console.log('>>>show me the money: ', money);

      // if the query result is in the cache then return it
      if (cacheHit) {
        // console.log('>>>$$$ cache money $$$');
        res.locals.value = money.result;
        
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
          body: JSON.stringify(req.body),
        })
          .then((r) => r.json())
          .then((data) => {
            console.log('>>>query data from /graphql api: ', data);
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
    
    // if the query is a 'Mutation' type - assumptions:
    // (1) mutations only mutate a single object type at a time - can iterate on this
    // (2) mutations always require a single argument (id) - can iterate on this
    // (3) mutations always return the object mutated
    if (operation === 'mutation') {
      console.log('>>>in the mutation if statement of the TroveQL middleware');
      fetch(this.graphQLAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      })
      .then(r => r.json())
      .then((data) => {
        res.locals.value = data;
        console.log('>>>mutation data from /graphql api: ', data);

        const mutationObjType: string = this.mutations[objectType]; // assuming mutations only impact one Type
        console.log('>>>mutationObjType: ', mutationObjType);
        const mutationCacheKey: string = mutationObjType + '_' + data.data[objectType].id; //this seems pretty hard-coded currently...
        console.log('>>>mutationCacheKey: ', mutationCacheKey);
        const mutationCacheVal: ResponseType = this.cache.get(mutationCacheKey);
        console.log('>>>mutationCacheVal: ', mutationCacheKey);

        // if the mutation was a delete - the response object from the graphQL API and the cache are equal to each other
        // edge case: we update something without actually changing anything, then we would be deleting it from the cache thinking it was a delete
          // this is ok since we care more about keeping fresh data in the cache than not having something in the cache to serve to the client
        if (mutationCacheVal.result === data) {
          // delete it from the cache if it's in there, otherwise we don't need to do anything
          this.cache.removeOne(mutationCacheKey);
        } else {
        // if the mutation was an add or update
          // if the mutation was an update then delete the existing item in the cache if it's there
          if (!mutationCacheVal.miss) {
            this.cache.removeOne(mutationCacheKey);
          }

          /*
            // if the mutation was an add or it was an update but we didn't find it in the cache then we would treat it as an add to the cache
              // add the fresh data to the cache
            const cacheValue: ResponseType = {
              query: cacheKey,
              result: data,
              miss: mutationCacheVal.miss, // but we're not requesting the data, we're just updating it...
            };
            this.cache.set(cacheValue);
          */
        }

        // need to delete any "get all" queries - assuming there are only 2 types of queries: get one or get all
        const cacheKeys = this.cache.keys();
        console.log('>>>cacheKeys post-mutation cache invalidation on single object Type: ', cacheKeys);
        for (const key of cacheKeys) {
          // this is based on how we store cache keys - if it doesn't include '_' then it's a get all query
          if (!key.includes('_')) {
            this.cache.removeOne(key); // if we update the details of a movie, the query to get a single actor who's in that movie (if we had such a query) would not be updated...
          }
        }

        // send mutation query + variables + updated cache size to TM - no cacheHit or queryTime to report
        if (this.useTroveMetrics) {
          this.sendData(null, query, variables, this.cache.cacheSize(), null);
        }

        // prints everything in the cache - delete
        console.log('>>>Updated cache in the bank:');
        this.cache.returnAll();

        return next();
      })
      .catch(error => console.log(error));
    }

    // there is also a "Subscription" type - for future iterations
    if (operation === 'subscription') {

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
  parseQuery = (query: string): QueryInfo => {
    const parsedQuery: DocumentNode = parse(query);
    // declare variable operations and assign it with 'query' or 'mutation' from parsedQuery
    const operation: string = parsedQuery['definitions'][0].operation;

    // let's assume we're only going to query a single object Type from the graphQL API Schema
    const objectType: string = parsedQuery['definitions'][0].selectionSet.selections[0].name.value;
    console.log('>>>parsedQuery Type: ', objectType);

    // with nested queries, this gets complicated because theoretically there could be an infinite number of subqueries
    const objectFieldsArray: any = parsedQuery['definitions'][0].selectionSet.selections[0].selectionSet.selections;
    const objectFields: string[] = [];
    for (let i = 0; i < objectFieldsArray.length; i++) {
      objectFields.push(objectFieldsArray[i].name.value)
      console.log('>>>parsedQuery selectionSet fields: ', objectFieldsArray[i].name.value);
    }

    return { operation, objectType, objectFields };
  };
}

export { TroveQLCache };

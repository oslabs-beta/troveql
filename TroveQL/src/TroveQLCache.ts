import { TroveCache } from './arc/arc';
import { parse, DocumentNode } from 'graphql';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Variables, QueryInfo } from './types';
import { ResponseType, CacheSizeType } from './arc/arcTypes';

class TroveQLCache {
  // pass TroveQLCache the capacity of the cache, the graphQL API to query, if you would like to use TroveMetrics, and an object with the names of your graphQL API's Mutation types and the object type(s) they mutate (if applicable)
  cache: TroveCache;
  constructor(
    public capacity: number,
    public graphQLAPI: string,
    public useTroveMetrics: boolean = false,
    public mutations?: Variables
  ) {
    this.cache = new TroveCache(capacity);
    this.capacity = capacity;
    this.graphQLAPI = graphQLAPI;
    this.useTroveMetrics = useTroveMetrics;
    this.mutations = mutations;
  }

  // queryCache is the Express middleware that parses the incoming GraphQL API query and gets/sets the cache
  queryCache: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // startTime is for TM, otherwise just grab the query string and its variables (if defined) from the request body
    const startTime: number = this.useTroveMetrics ? Date.now() : null;
    const query: string = req.body.query;
    const variables: Variables = req.body.variables;

    // declare variables for the operation type ('query' or 'mutation') and the Type of query (this is based on the graphQL schema)
    const { operation, objectType }: QueryInfo = this.parseQuery(
      req.body.query
    );

    // normalize the cache key - assumptions:
    // (1) queries always return the id of the object as a field
    // (2) queries only have 0 or 1 arguments (id) - can iterate on this
    let cacheKey: string = variables
      ? objectType + '_' + variables.id
      : objectType;

    // if the query is a 'Query' type
    if (operation === 'query') {
      // get from the cache
      const money: ResponseType = this.cache.get(cacheKey);
      const cacheHit: boolean = money.miss ? false : true;

      // if the query result is in the cache then return it
      if (cacheHit) {
        res.locals.value = money.result;

        if (this.useTroveMetrics) {
          const finishTime = Date.now();
          this.sendData(
            cacheHit,
            query,
            variables,
            this.cache.cacheSize(),
            finishTime - startTime,
            this.capacity
          );
        }
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
            res.locals.value = data;
            
            // the set method will use the value of 'query' (equal to cacheKey - normalized to be the query Type and the id, if applicable) for the cacheKey (what you use to invoke the get method)
            // & will use the value of 'result' (the data from the graphQL API) for the cache value
            // the 'miss' value just tells the cache HOW it previously missed to inform how to cache it (based on the ARC algorithm)
            const cacheValue: ResponseType = {
              query: cacheKey,
              result: data,
              miss: money.miss,
            };
            this.cache.set(cacheValue);

            if (this.useTroveMetrics) {
              const finishTime = Date.now();
              this.sendData(
                cacheHit,
                query,
                variables,
                this.cache.cacheSize(),
                finishTime - startTime,
                this.capacity
              );
            }

            return next();
          })
          .catch((error) => console.log('Error calling the GraphQL API from the TroveQL middleware on cache MISS: ', error));
      }
    }

    // if the query is a 'Mutation' type - assumptions:
    // (1) mutations only mutate a single object type at a time - can iterate on this
    // (2) mutations always require a single argument (id) - can iterate on this
    // (3) mutations always return the object mutated
    if (operation === 'mutation') {
      // if it's a mutation, forward this query to the graphQL API to execute the mutation
      fetch(this.graphQLAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      })
        .then((r) => r.json())
        .then((data) => {
          res.locals.value = data;

          // assumption #1 - get the Type this mutation mutates on the graphQL schema
          const mutationObjType: string = this.mutations[objectType];
          // assumption #2 - build the cacheKey with the query Type for this mutation plus the id
          const mutationCacheKey: string =
            mutationObjType + '_' + data.data[objectType].id;
          // check if the Type this mutation mutated is stored in the cache
          const mutationCacheVal: ResponseType =
            this.cache.get(mutationCacheKey);

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
          }

          // need to delete any "get all" queries - assuming there are only 2 types of queries: get one or get all
          const cacheKeys = this.cache.keys();
          for (const key of cacheKeys) {
            // this is based on how we store cache keys - if it doesn't include '_' then it's a get all query
            if (!key.includes('_')) {
              this.cache.removeOne(key);
            }
          }

          // send mutation query + variables + updated cache size to TM - no cacheHit or queryTime to report
          if (this.useTroveMetrics) {
            this.sendData(
              null,
              query,
              variables,
              this.cache.cacheSize(),
              null,
              this.capacity
            );
          }

          return next();
        })
        .catch((error) => console.log('Error calling the GraphQL API from the TroveQL middleware on mutation: ', error));
    }

    // there is also a "Subscription" type - for future iterations
    if (operation === 'subscription') {
    }
  };

  // troveMetrics is another Express middleware that clears the cache on requests from TM
  troveMetrics: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // if clearCache (in req.body from troveMetrics) is true
    if (req.body.clearCache) {
      this.cache.removeAll();
      res.locals.message = { cacheEmpty: true };
    }
    return next();
  };

    // resetCache clears all cache when user is at demo homepage
  resetCache: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
      this.cache.removeAll();
      return next();
  };

  // sendData to TroveMetrics
  // send data to localhost 3333 where troveMetrics server is listening to
  sendData = (
    cacheHit?: boolean,
    query?: string,
    variables?: Variables,
    cacheSize?: CacheSizeType,
    queryTime?: number,
    capacity?: number
  ): void => {
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
        capacity,
      }),
    })
      .catch((err) => console.log('Error calling the TroveMetrics API from the TroveQL middleware: ', err));
  };

  // parseQuery checks if the graphQL API query is a query or a mutation type
  parseQuery = (query: string): QueryInfo => {
    const parsedQuery: DocumentNode = parse(query);
    // declare variable operations and assign it with 'query' or 'mutation' from parsedQuery
    const operation: string = parsedQuery['definitions'][0].operation;

    // let's assume we're only going to query a single object Type from the graphQL API Schema
    const objectType: string =
      parsedQuery['definitions'][0].selectionSet.selections[0].name.value;

    return { operation, objectType };
  };
}

export { TroveQLCache };

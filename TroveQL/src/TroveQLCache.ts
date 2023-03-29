import { Cache } from './basic-cache';
import { parse } from 'graphql';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { DocumentNode } from 'graphql';
import { Variables, RequestBody } from './types';

class TroveQLCache {
  cache: Cache;
  constructor(persist: number, public graphAPI: string) {
    this.cache = new Cache(persist);
    this.graphAPI = graphAPI;
  }

  queryCache: RequestHandler = (req: Request , res: Response, next: NextFunction): void => {
    // console.log('>>>Cache in the bank: ', this.cache.cache);
    // will need to figure out how to use this for subqueries / mutations...
    const reqBody: RequestBody = req.body;
    const query: string = req.body.query;
    const operation: string = this.parseQuery(query);
    const variables: Variables = req.body.variables;

    if (operation === 'query') {
      const money: string | undefined = this.cache.get(reqBody); //cache get method needs to be updated to receive an object instead of a string
      let cacheHit: boolean = false;
      if (money) {
        console.log('>>>$$$ cache money $$$');
        cacheHit = true;
        res.locals.value = money;
        return next();
      } else {
        fetch(this.graphAPI, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query,
            variables
          }),
        })
        .then(r => r.json())
        .then((data) => {
          console.log('data from /graphql api: ', data);
          this.cache.set(reqBody, data); //set method needs to receive an object & I would've thought data is an object but I think it's a string...
          res.locals.value = data;
          return next();
        })
      }
      fetch('http://localhost:3333/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cacheHit,
          query,
          variables
        }),
      })
      .then(r => r.json())
      .then((data) => {
        console.log(data);
      })
      .catch(err => console.log(err));
    } 
    // else {
    //   // for mutations...
    //   // return next();
    // }
  };

  parseQuery = (query: string): string => {
    const parsedQuery: DocumentNode = parse(query);
    const operation: string = parsedQuery["definitions"][0].operation;
    return operation;
  }
}

export { TroveQLCache };

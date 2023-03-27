import { Cache } from './basic-cache';
import { parse } from 'graphql';
import { Request, Response, NextFunction, RequestHandler } from 'express';

type Arg = {
  [ key : string ] : string
};

type RequestInfo = {
  operation: string,
  args: Arg
};

class TroveQLCache {
  cache: Cache;
  constructor (persist: number, public graphAPI: string) {
    this.cache = new Cache(persist);
    this.graphAPI = graphAPI;
  }

  queryCache: RequestHandler = (req: Request , res: Response, next: NextFunction): void => {
    console.log('req.body: ', req.body);
    console.log('>>>Cache in the bank: ', this.cache.cache);
    // will need to figure out how to use this for subqueries / mutations...
    const parsedQuery: RequestInfo = this.parseQuery(req.body.query);

    if (parsedQuery.operation === 'query') {
      const money = this.cache.get(req.body.query);
      let cacheHit: number = 0;
      if (money) {
        console.log('>>>$$$ cache money $$$');
        cacheHit = 1;
        res.locals.value = money;
      } else {
        fetch(this.graphAPI, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            query: req.body.query,
            // variables: parsedQuery.args //this doesn't seem to be necessary...
          }),
        })
        .then(r => r.json())
        .then((data) => {
          this.cache.set(req.body.query, data);
          res.locals.value = data;
        })
      }
      // fetch('http://localhost:3333/api', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ 
      //     cacheHit
      //   }),
      // })
      // .then(r => r.json())
      // .then((data) => {
      //   console.log(data);
      // })
      // .catch(err => console.log(err));
      return next();
    } 
    
    // else {
    //   // for mutations...
    //   // return next();
    // }
  }

  parseQuery = (query: string): RequestInfo => {
    const parsedQuery = parse(query); //not sure how to Type this fat object
    const operation: string = parsedQuery.definitions[0].operation;

    const argsArray = parsedQuery.definitions[0].selectionSet.selections[0].arguments; //not sure how to Type this array of objects
    const args : Arg = {};
    for (let i = 0; i < argsArray.length; i++) {
      args[argsArray[i].name.value] = argsArray[i].value.value;
    }

    return { operation, args };
  }
}

export { TroveQLCache };
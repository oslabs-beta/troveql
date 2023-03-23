import { Cache } from './basic-cache';
import { parse } from 'graphql';
import axios from 'axios';

class TroveQLCache {
  cache: Cache;
  graphAPI: string;

  constructor (persist: number, graphAPI: string) {
    // add persist as an argument to new Cache()...
    this.cache = new Cache();
    this.graphAPI = graphAPI;
  }

  public queryCache(req: { body: { query: string } }, res: { locals: { value?: any } }, next: any): any {
    const headers = {
      'Content-Type': 'application/json'
    };

    // const parsedQuery = this.parseQuery(req.body.query);
    const parsedQuery = parse(req.body.query);
    const operation = parsedQuery.definitions[0].operation;
    const parsedArgs = parsedQuery.definitions[0].selectionSet.selections[0].arguments;
    const args = {};
    for (let i = 0; i < parsedArgs.length; i++) {
      // parsedArgs.push(args[i]name.value);
      args[parsedArgs[i].name.value] = parsedArgs[i].value.value;
    }
    // res.locals.value = { operation, args };

    if (operation === 'query') {
      const money = this.cache.get(req.body.query);
      if (money) {
        res.locals.value = money;
      } else {
        const graphQuery = { query: req.body.query };
        axios.post(this.graphAPI, {
          headers,
          data: graphQuery
        })
        .then((response) => {
          console.log(response)
          // this.cache.set(req.body.query, response);
          res.locals.value = response;
          return next();
        })
      }
    } 
    // else {
    //   // for mutations...
    //   // return next();
    // }
  }

  // public parseQuery(query: any): any {
  //   const parsedQuery = parse(query);
  //   const operation = parsedQuery.definitions[0].operation;

  //   if (operation === 'query') {
  //     const args = parsedQuery.definitions[0].selectionSet.selections[0].arguments;
  //     const parsedArgs = [];
  //     for (let i = 0; i < args.length; i++) {
  //       parsedArgs.push(args[i]name.value);
  //     }
  //   } else {
  //     // for mutations...
  //   }

  //   return { operation, parsedArgs };
  // }
}

export { TroveQLCache };
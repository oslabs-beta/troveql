import { Cache } from './basic-cache';
import { parse } from 'graphql';

class TroveQLCache {
  cache: Cache;
  constructor (persist: number, public graphAPI: string) {
    this.cache = new Cache(persist);
    this.graphAPI = graphAPI;
  }

  queryCache = (req: { body: { query: string } }, res: { locals: { value?: any } }, next: any): any => {
    console.log('>>>Cache in the bank: ', this.cache.cache);
    // will need to figure out how to use this for subqueries / mutations...
    const parsedQuery = this.parseQuery(req.body.query);

    if (parsedQuery.operation === 'query') {
      const money = this.cache.get(req.body.query);
      if (money) {
        console.log('>>>$$$ cache money $$$');
        res.locals.value = money;
        return next();
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
          return next();
        })
      }
    } else {
      // for mutations...
      // return next();
    }
  }

  parseQuery = (query: any): any => {
    const parsedQuery = parse(query);
    const operation = parsedQuery.definitions[0].operation;

    const argsArray = parsedQuery.definitions[0].selectionSet.selections[0].arguments;
    type Arg = {[key: string] : string};
    const args : Arg = {};
    for (let i = 0; i < argsArray.length; i++) {
      args[argsArray[i].name.value] = argsArray[i].value.value;
    }

    return { operation, args };
  }
}

export { TroveQLCache };
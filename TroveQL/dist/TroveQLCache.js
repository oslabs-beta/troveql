"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveQLCache = void 0;
const basic_cache_1 = require("./basic-cache");
const graphql_1 = require("graphql");
class TroveQLCache {
    constructor(persist, graphAPI) {
        this.graphAPI = graphAPI;
        this.queryCache = (req, res, next) => {
            // console.log('>>>Cache in the bank: ', this.cache.cache);
            // will need to figure out how to use this for subqueries / mutations...
            const reqBody = req.body;
            const query = req.body.query;
            const operation = this.parseQuery(query);
            const variables = req.body.variables;
            if (operation === 'query') {
                const money = this.cache.get(reqBody); //cache get method needs to be updated to receive an object instead of a string
                let cacheHit = false;
                if (money) {
                    console.log('>>>$$$ cache money $$$');
                    cacheHit = true;
                    res.locals.value = money;
                    return next();
                }
                else {
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
                    });
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
        this.parseQuery = (query) => {
            const parsedQuery = (0, graphql_1.parse)(query);
            const operation = parsedQuery["definitions"][0].operation;
            return operation;
        };
        this.cache = new basic_cache_1.Cache(persist);
        this.graphAPI = graphAPI;
    }
}
exports.TroveQLCache = TroveQLCache;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveQLCache = void 0;
const basic_cache_1 = require("./basic-cache");
const graphql_1 = require("graphql");
class TroveQLCache {
    constructor(persist, graphAPI) {
        this.graphAPI = graphAPI;
        this.queryCache = (req, res, next) => {
            console.log('req.body: ', req.body);
            console.log('>>>Cache in the bank: ', this.cache.cache);
            // will need to figure out how to use this for subqueries / mutations...
            const parsedQuery = this.parseQuery(req.body.query);
            if (parsedQuery.operation === 'query') {
                const money = this.cache.get(req.body.query);
                let cacheHit = 0;
                if (money) {
                    console.log('>>>$$$ cache money $$$');
                    cacheHit = 1;
                    res.locals.value = money;
                }
                else {
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
                    });
                }
                fetch('http://localhost:3333/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cacheHit
                    }),
                })
                    .then(r => r.json())
                    .then((data) => {
                    console.log(data);
                })
                    .catch(err => console.log(err));
                return next();
            }
            // else {
            //   // for mutations...
            //   // return next();
            // }
        };
        this.parseQuery = (query) => {
            const parsedQuery = (0, graphql_1.parse)(query);
            const operation = parsedQuery.definitions[0].operation;
            const argsArray = parsedQuery.definitions[0].selectionSet.selections[0].arguments;
            const args = {};
            for (let i = 0; i < argsArray.length; i++) {
                args[argsArray[i].name.value] = argsArray[i].value.value;
            }
            return { operation, args };
        };
        this.cache = new basic_cache_1.Cache(persist);
        this.graphAPI = graphAPI;
    }
}
exports.TroveQLCache = TroveQLCache;

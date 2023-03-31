"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveQLCache = void 0;
const arc_1 = require("./arc/arc");
const graphql_1 = require("graphql");
class TroveQLCache {
    constructor(size, graphAPI) {
        this.graphAPI = graphAPI;
        this.queryCache = (req, res, next) => {
            console.log('>>>Cache in the bank (see below)');
            this.cache.returnAll();
            // will need to figure out how to use this for subqueries / mutations...
            const cacheKey = this.stringify(req.body);
            const query = req.body.query;
            const operation = this.parseQuery(query);
            const variables = req.body.variables;
            const cacheSize = this.cache.cacheSize();
            if (operation === 'query') {
                const money = this.cache.get(cacheKey); //cache get method needs to be updated to receive an object instead of a string
                console.log('>>>show me the money: ', money);
                let cacheHit = false;
                if (!money.miss) {
                    console.log('>>>$$$ cache money $$$');
                    cacheHit = true;
                    res.locals.value = money.result;
                    this.sendData(cacheHit, query, variables, cacheSize);
                    return next();
                }
                else {
                    fetch(this.graphAPI, {
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
                        console.log('>>>about to set the cache value: ', data);
                        const cacheValue = {
                            query: cacheKey,
                            result: data,
                            miss: money.miss,
                        };
                        this.cache.set(cacheValue); //set method needs to receive an object & I would've thought data is an object but I think it's a string...
                        res.locals.value = data;
                        this.sendData(cacheHit, query, variables, cacheSize);
                        return next();
                    });
                }
            }
            else if (operation === 'mutation') {
                console.log('>>>in the mutation if statement of the TroveQL middleware');
                fetch(this.graphAPI, {
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
                    this.sendData();
                    return next();
                });
            }
        };
        this.sendData = (cacheHit, query, variables, cacheSize) => {
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
        this.parseQuery = (query) => {
            const parsedQuery = (0, graphql_1.parse)(query);
            const operation = parsedQuery['definitions'][0].operation;
            return operation;
        };
        this.stringify = (object) => {
            return JSON.stringify(object);
        };
        this.cache = new arc_1.TroveCache(size);
        this.graphAPI = graphAPI;
    }
}
exports.TroveQLCache = TroveQLCache;

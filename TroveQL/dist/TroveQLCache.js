"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveQLCache = void 0;
const arc_1 = require("./arc/arc");
const graphql_1 = require("graphql");
//up next: invoke global error handler in the user's Node/Express server if there is an error - but how do we know what shape it will look like?
class TroveQLCache {
    constructor(size, graphQLAPI, useTroveMetrics = false) {
        this.graphQLAPI = graphQLAPI;
        this.useTroveMetrics = useTroveMetrics;
        this.queryCache = (req, res, next) => {
            const operation = this.parseQuery(req.body.query);
            const query = req.body.query;
            const variables = req.body.variables;
            const cacheKey = JSON.stringify(req.body);
            if (operation === 'query') {
                const money = this.cache.get(cacheKey);
                const cacheHit = money.miss ? false : true;
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
                }
                else {
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
                        const cacheValue = {
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
        this.troveMetrics = (req, res, next) => {
            if (req.body.clearCache) {
                this.cache.removeAll();
                res.locals.message = { cacheEmpty: true };
            }
            return next();
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
        this.cache = new arc_1.TroveCache(size);
        this.graphQLAPI = graphQLAPI;
        this.useTroveMetrics = useTroveMetrics;
    }
}
exports.TroveQLCache = TroveQLCache;
// test npmignore

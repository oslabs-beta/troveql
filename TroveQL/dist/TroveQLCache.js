"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveQLCache = void 0;
const arc_1 = require("./arc/arc");
const graphql_1 = require("graphql");
class TroveQLCache {
    constructor(size, graphQLAPI, useTroveMetrics = false) {
        this.graphQLAPI = graphQLAPI;
        this.useTroveMetrics = useTroveMetrics;
        // queryCache is the Express middleware that parses the incoming GraphQL API query and gets/sets the cache
        this.queryCache = (req, res, next) => {
            const startTime = this.useTroveMetrics ? Date.now() : null;
            const operation = this.parseQuery(req.body.query);
            const query = req.body.query;
            const variables = req.body.variables;
            // Whole req.body incl query and variables
            const cacheKey = JSON.stringify(req.body);
            // if the query is a 'Query' type
            if (operation === 'query') {
                // get from the cache
                const money = this.cache.get(cacheKey);
                // not necessarily boolean ?
                const cacheHit = money.miss ? false : true;
                console.log('>>>show me the money: ', money);
                // if the query result is in the cache then return it
                if (cacheHit) {
                    // console.log('>>>$$$ cache money $$$');
                    res.locals.value = money.result;
                    // if user wants to use TroveMetrics
                    if (this.useTroveMetrics) {
                        const finishTime = Date.now();
                        this.sendData(cacheHit, query, variables, this.cache.cacheSize(), this.size, finishTime - startTime);
                    }
                    // prints everything in the cache - delete
                    console.log('>>>Updated cache in the bank:');
                    this.cache.returnAll();
                    return next();
                    // if the query result is NOT in the cache then fetch from the graphQL API and then add the query result to the cache
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
                            const finishTime = Date.now();
                            this.sendData(cacheHit, query, variables, this.cache.cacheSize(), this.size, finishTime - startTime);
                        }
                        // prints everything in the cache - delete
                        console.log('>>>Updated cache in the bank:');
                        this.cache.returnAll();
                        return next();
                    })
                        .catch(error => console.log(error));
                }
            }
            // if the query is a 'Mutation' type
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
        // troveMetrics is another Express middleware that clears the cache on requests from TM
        this.troveMetrics = (req, res, next) => {
            // if clearCache (in req.body from troveMetrics) is true 
            if (req.body.clearCache) {
                this.cache.removeAll();
                res.locals.message = { cacheEmpty: true };
            }
            return next();
        };
        // sendData to TroveMetrics
        // send data to localhost 3333 where troveMetrics server is listening to
        this.sendData = (cacheHit, query, variables, cacheSize, queryTime, size) => {
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
        this.parseQuery = (query) => {
            // parse graphQL string
            const parsedQuery = (0, graphql_1.parse)(query);
            // declare variable operations and assign it with 'query' or 'mutation' from parsedQuery
            const operation = parsedQuery['definitions'][0].operation;
            return operation;
        };
        this.cache = new arc_1.TroveCache(size);
        this.graphQLAPI = graphQLAPI;
        this.useTroveMetrics = useTroveMetrics;
        this.size = size;
    }
}
exports.TroveQLCache = TroveQLCache;

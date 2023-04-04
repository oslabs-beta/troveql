"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveQLCache = void 0;
const arc_1 = require("./arc/arc");
const graphql_1 = require("graphql");
class TroveQLCache {
    constructor(size, graphQLAPI, useTroveMetrics = false, mutations) {
        this.graphQLAPI = graphQLAPI;
        this.useTroveMetrics = useTroveMetrics;
        this.mutations = mutations;
        // queryCache is the Express middleware that parses the incoming GraphQL API query and gets/sets the cache
        this.queryCache = (req, res, next) => {
            const startTime = this.useTroveMetrics ? Date.now() : null;
            const query = req.body.query;
            const variables = req.body.variables;
            const { operation, objectType, objectFields } = this.parseQuery(req.body.query);
            // normalize the cache key - assumptions: 
            // (1) queries always return the id of the object as a field
            // (2) queries only have 0 or 1 arguments (id)
            let cacheKey = variables ? (objectType + '_' + variables.id) : objectType;
            // if the query is a 'Query' type
            if (operation === 'query') {
                // get from the cache
                const money = this.cache.get(cacheKey);
                const cacheHit = money.miss ? false : true;
                console.log('>>>show me the money: ', money);
                // if the query result is in the cache then return it
                if (cacheHit) {
                    console.log('>>>$$$ cache money $$$');
                    res.locals.value = money.result;
                    if (this.useTroveMetrics) {
                        const finishTime = Date.now();
                        this.sendData(cacheHit, query, variables, this.cache.cacheSize(), finishTime - startTime);
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
                            this.sendData(cacheHit, query, variables, this.cache.cacheSize(), finishTime - startTime);
                        }
                        // prints everything in the cache - delete
                        console.log('>>>Updated cache in the bank:');
                        this.cache.returnAll();
                        return next();
                    })
                        .catch(error => console.log(error));
                }
            }
            // if the query is a 'Mutation' type - assumptions:
            // (1) mutations only mutate a single object type at a time
            // (2) mutations always require a single argument (id)
            // (3) mutations always return the object mutated
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
                    const mutationObjType = this.mutations[objectType];
                    const mutationCacheKey = mutationObjType + '_' + data.id;
                    const mutationCacheVal = this.cache.get(mutationCacheKey);
                    // if the mutation was a delete - the response object from the graphQL API and the cache are equal to each other
                    if (!mutationCacheVal.miss && (mutationCacheVal.result === data)) {
                        this.cache.delete(mutationCacheKey);
                    }
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
            // there is also a "Subscription" type - for future iterations
            if (operation === 'subscription') {
            }
        };
        // troveMetrics is another Express middleware that clears the cache on requests from TM
        this.troveMetrics = (req, res, next) => {
            if (req.body.clearCache) {
                this.cache.removeAll();
                res.locals.message = { cacheEmpty: true };
            }
            return next();
        };
        // sendData to TroveMetrics
        this.sendData = (cacheHit, query, variables, cacheSize, queryTime) => {
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
                    queryTime
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
            const parsedQuery = (0, graphql_1.parse)(query);
            const operation = parsedQuery['definitions'][0].operation;
            // let's assume we're only going to query a single object Type from the graphQL API Schema
            const objectType = parsedQuery['definitions'][0].selectionSet.selections[0].name.value;
            console.log('>>>parsedQuery Type: ', parsedQuery['definitions'][0].selectionSet.selections.name.value);
            // with nested queries, this gets complicated because theoretically there could be an infinite number of subqueries
            const objectFieldsArray = parsedQuery['definitions'][0].selectionSet.selections[0].selectionSet.selections;
            const objectFields = [];
            for (let i = 0; i < objectFieldsArray.length; i++) {
                objectFields.push(objectFieldsArray[i].name.value);
                console.log('>>>parsedQuery selectionSet fields: ', objectFieldsArray[i].name.value);
            }
            return { operation, objectType, objectFields };
        };
        this.cache = new arc_1.TroveCache(size);
        this.graphQLAPI = graphQLAPI;
        this.useTroveMetrics = useTroveMetrics;
        this.mutations = mutations;
    }
}
exports.TroveQLCache = TroveQLCache;

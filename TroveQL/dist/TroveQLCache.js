"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TroveQLCache = void 0;
const basic_cache_1 = require("./basic-cache");
const graphql_1 = require("graphql");
class TroveQLCache {
    constructor(persist, graphAPI) {
        // add persist as an argument to new Cache()...
        this.cache = new basic_cache_1.Cache();
        this.graphAPI = graphAPI;
    }
    queryCache(req, res, next) {
        // const parsedQuery = this.parseQuery(req.body.query);
        const parsedQuery = (0, graphql_1.parse)(req.body.query);
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
            }
            else {
                const graphQuery = { query: req.body.query };
                fetch(this.graphAPI);
            }
            return next();
        }
        else {
            // for mutations...
            // return next();
        }
    }
}
exports.TroveQLCache = TroveQLCache;

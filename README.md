<div align="center">
  <img src='/assets/TroveQL-black.svg'>
  <h1>Welcome to TroveQL!</h1>
  <p>TroveQL is a cache library for GraphQL APIs on Express.js servers with additional support for TroveMetrics, a cache performance monitoring application.</p>
  <img alt="GitHub" src="https://img.shields.io/github/license/oslabs-beta/troveql" style="max-width:100%;">
</div>

## Features
- Server-side cache for GraphQL queries using the Advanced Replacement Cache (ARC) algorithm
- Custom cache configurations with options such as total capacity
- Cache invalidation logic on GraphQL mutations
- Support for Node.js/Express.js servers
- Cache performance monitoring with key metrics such as Hit/Miss Rate and Query Response Time

## Documentation
Visit our website (insert website link) to get more information and watch a demo of TroveQL and its performance monitoring application TroveMetrics.

## Table of Contents
- [Install](#install-troveql)
- [Set Up](#set-up-troveql-in-express)
- [Queries and Mutations](#query-or-mutate-your-graphQL-API)
- [Roadmap](#iteration-roadmap)
- [Stack](#stack)
- [Authors](#authors)
- [License](#license)

## Install TroveQL
Install the Express library via npm.

```bash
npm install troveql
```

## Set up TroveQL in Express
1. Import TroveQLCache.
```javascript
const { TroveQLCache } = require('troveql');
```

2. Set up your TroveQL cache.
```javascript
const capacity = 5; // size limit of your cache
const graphQLAPI = 'http://localhost:4000/graphql'; // your graphQL URL endpoint
const useTroveMetrics = true; // (optional) if you would like to use TroveMetrics - default is false
const mutations = {}; // (optional) object where key/value pairs are mutation types/object types mutated (ex. { addMovie: 'movie', editMovie: 'movie', deleteMovie: 'movie' })
const cache = new TroveQLCache(capacity, graphQLAPI, useTroveMetrics, mutations);
```

3. Add the /troveql and, if applicable, /trovemetrics endpoints.
```javascript
// REQUIRED
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// /troveql to use the cache
app.use('/troveql', 
  cache.queryCache,
  (req: Request, res: Response) => res.status(200).json(res.locals.value)
);

// /trovemetrics to clear the cache from TroveMetrics
app.use('/trovemetrics', 
  cache.troveMetrics,
  (req: Request, res: Response) => res.status(200).json(res.locals.message)
);
```

4. Add your GraphQL endpoint. For example:
```javascript
const { graphqlHTTP } = require("express-graphql");
const { schema } = require('./schema');
const { resolvers } = require('./resolvers');

app.use('/graphql', 
  graphqlHTTP({
    schema: schema, 
    rootValue: resolvers,
    graphiql: true
  })
);
```

5. To use TroveMetrics, run `npm start` on the command line from the `TroveMetrics/` folder to spin up the desktop application and monitor the performance of your cache and GraphQL API on your application's server.

## Query or Mutate your GraphQL API
Simply send a request to your GraphQL API for queries and mutations as you normally would. For example, a query with variables using the `fetch` syntax could look like:
```javascript
fetch('/troveql', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({
    query: `query ($id: ID) {
      movie(id: $id) {
          id
          title
          genre
          year
          actors 
            {
              name
            }
      }
    }`,
    variables: { id: 10 }
  })
})
.then(response => response.json())
.then(response => {
  // access the data on the response object with response.data
})
```

## Iteration Roadmap
- Client-side caching
- Persistent queries to improve the performance and security of client queries to the server
- Additional cache invalidation logic on mutations
- Update cache capacity to reflect memory size (bytes) instead of number of items
- User authentication for TroveMetrics

## Stack
- React.js
- Chart.js
- Electron
- Node.js
- Express.js
- GraphQL
- TypeScript
- JavaScript
- HTML
- CSS / SASS
- Webpack
- Jest

## Authors
Alex Klein - [GitHub](https://github.com/a-t-klein) | [LinkedIn](https://www.linkedin.com/in/alex-t-klein-183aa758/)
<br>
Erika Jung - [GitHub](https://github.com/erikahjung) | [LinkedIn](https://www.linkedin.com/in/erikahjung)
<br>
Sam Henderson - [GitHub](https://github.com/samhhenderson) | [LinkedIn](https://www.linkedin.com/in/samuel-h-henderson/)
<br>
Tricia Yeh - [GitHub](https://github.com/triciacorwin) | [LinkedIn](https://www.linkedin.com/in/tricia-yeh/)
<br>

## License
This project is licensed under the MIT License.
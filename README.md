# TroveQL
(insert logo HERE)

<h1>Welcome to TroveQL!</h1>
<p align="center">
  <img alt="GitHub" src="https://img.shields.io/github/license/oslabs-beta/troveql">
</p>
<p>TroveQL is a cache library for GraphQL APIs on Express.js servers with the optional use of TroveMetrics, a cache performance monitoring application.</p>

## Features
- Cache GraphQL queries on your server with an implementation of the Advanced Replacement Cache (ARC) algorithm.
- Configure your cache with options such as the total capacity.
- Cache invalidation on GraphQL mutations.
- Compatible with Node.js/Express.js servers.
- View the performance of your cache and GraphQL API with key metrics such as Hit/Miss Rate and Query Response Time.

## Overview
- Visit our website (insert website link HERE) to get more information on TroveQL and its performance monitoring application TroveMetrics (and to see a demo?).

## Table of Contents
- [Install](#install-troveql)
- [Set Up](#set-up-troveql-in-express.js)
- [Queries and Mutations](#query-or-mutate-your-graphQL-API)
- [Roadmap ?](#iteration-roadmap)
- [Stack] (#stack)
- [Authors](#authors)
- [License](#license)

## Install TroveQL
Install the Express.js library via npm.

```
npm install troveql
```

## Set up TroveQL in Express.js
1. Import TroveQLCache.
`const { TroveQLCache } = require('troveql');`

2. Set up your TroveQL cache.
```
const capacity = '//number: size limit of your cache';
const graphQLAPI = '//string: your graphQL URL endpoint';
const useTroveMetrics = '//(optional) boolean: if you would like to use TroveMetrics - default is false';
const mutations = {}; //(optional) object: keys are mutation types and values are strings of query types mutated (ex. { addMovie: 'movie', editMovie: 'movie', deleteMovie: 'movie' })
const cache = new TroveQLCache(capacity, graphQLAPI, true, mutations);
```

3. Add the /troveql and, if applicable, /trovemetrics endpoints.
```
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
```
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

5. To use TroveMetrics, run `npm start` on the command line from the `TroveMetrics/` folder to spin up the desktop application and monitor the performance of your cache in your application's server.

## Query or Mutate your GraphQL API
1. Simply send a request to your GraphQL API for queries and mutations as you normally would. For example, using `fetch` syntax:
```
fetch('/troveql', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({
    query: '//string: your query or mutation string',
    variables: {} //(optional) object: keys/values are variable names/values (ex. { id: 10 })
  })
})
.then(response => response.json())
.then(response => {
  // access the data on the response object using response.data
})
```

## Iteration Roadmap ?

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
Erika Jung - [GitHub](https://github.com/erikahjung) | [LinkedIn](https://www.linkedin.com/in/erikahjung)
Sam Henderson - [GitHub](https://github.com/samhhenderson) | [LinkedIn](https://www.linkedin.com/in/samuel-h-henderson/)
Tricia Yeh - [GitHub](https://github.com/triciacorwin) | [LinkedIn](https://www.linkedin.com/in/tricia-yeh/)

## License
This project is licensed under the MIT License.
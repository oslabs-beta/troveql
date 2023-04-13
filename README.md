<div align="center">
  <img src='/assets/TroveQL-black.svg' style="width:100%;">
  <h1>Welcome to TroveQL!</h1>
  <p>TroveQL is a cache library for GraphQL APIs on Express.js servers with additional support for TroveMetrics, a cache performance monitoring application.</p>
  <p><img alt="GitHub" src="https://img.shields.io/github/license/oslabs-beta/troveql"></p>
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
  <img src="https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">
  <img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white">
</div>

## Features
- Server-side cache for GraphQL queries using the Advanced Replacement Cache (ARC) algorithm
- Custom cache configurations with options such as total capacity
- Cache invalidation logic on GraphQL mutations
- Support for Node.js/Express.js servers
- Cache performance monitoring with key metrics such as Hit/Miss Rate and Query Response Time

## Documentation
Visit <a target="_blank" rel="noopener noreferrer" href="https://www.troveql.io/">our website</a> to get more information and watch a demo of TroveQL and its performance monitoring application TroveMetrics.

## Table of Contents
- [Install](#install-troveql)
- [Set Up](#set-up-troveql-in-express)
- [Queries and Mutations](#query-or-mutate-your-graphQL-API)
- [Roadmap](#iteration-roadmap)
- [Contribute](#contribution-guidelines)
- [Stack](#stack)
- [Authors](#authors)
- [License](#license)

## Install TroveQL
Install the Express library via npm

```bash
npm install troveql
```

## Set up TroveQL in Express
1. Import TroveQLCache
```javascript
const { TroveQLCache } = require('troveql');
```

2. Set up your TroveQL cache
```javascript
const capacity = 5; // size limit of your cache
const graphQLAPI = 'http://localhost:4000/graphql'; // your graphQL URL endpoint
const useTroveMetrics = true; // (optional) if you would like to use TroveMetrics - default is false
const mutations = {}; // (optional) object where key/value pairs are mutation types/object types mutated (ex. { addMovie: 'movie', editMovie: 'movie', deleteMovie: 'movie' })
const cache = new TroveQLCache(capacity, graphQLAPI, useTroveMetrics, mutations);
```

3. Add the /troveql and, if applicable, /trovemetrics endpoints
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

5. To use TroveMetrics to monitor the performance of your cache and GraphQL API on your application's server, you can go to <a href="https://www.troveql.io/" target="_blank" rel="noopener noreferrer">our website</a> and download the desktop application for your OS (macOS, Windows, Linux).

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
## TroveQL Demo
Download our TroveQL demo to see how TroveQL is run:
[troveql-demo](https://github.com/oslabs-beta/troveql-demo/)

## Feature Roadmap
- Client-side caching
- Persistent queries to improve the performance and security of client queries to the server
- Additional cache invalidation logic on mutations
- Additional cache logic on subscriptions
- Update cache capacity to reflect memory size (bytes) instead of number of items
- User authentication for TroveMetrics

## Contribution Guidelines
If you would like to contribute to this open-source project, please follow the steps below:
1. Fork the repository from the `dev` branch
2. Create a new feature branch (`git checkout -b feature/newFeature`)
3. Commit your changes with a descriptive comment (`git commit -m 'Added a new feature that ...'`)
4. Push your changes to the new feature branch (`git push origin feature/newFeature`)
5. Open a Pull Request on the `dev` branch
6. We will review your PR and merge the new feature into the `main` branch as soon as possible!

Thank you so much!

## Stack
- GraphQL
- Node.js / Express.js
- Electron
- React.js
- Chart.js
- Webpack
- TypeScript
- JavaScript
- HTML
- CSS / SASS
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
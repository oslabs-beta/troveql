import * as React from 'react';

function QueryList({ cacheData }) {
  let vars = [];
  let query = '';
  let list = [];

  // If no data, display nothing and avoid a crash
  if (cacheData && cacheData.queries && cacheData.queries.length > 0) {
  console.log('cacheData in list', cacheData.queries);
    let variables = cacheData.queries[cacheData.queries.length - 1].variables;
    query = cacheData.queries[cacheData.queries.length - 1].query;

    for (const key in variables) {
      vars.push(
        <p key={key}>
          {key} : {variables[key]}
        </p>
      );
    }

    // pass required info from cacheData to each row in table

    // slice out last 10 items in array
    const latestTen = cacheData.queries.slice(-5).reverse();
    console.log('lastTen',latestTen);
    // iterate through each item in array
      // through each iteration, 
        // create a new row
        // query Name 
          // with icon on hover // variables
        // More Info
          // in a card upon hovering
          // cacheHit
          // in t1 or t2 or b1 or b2
        // Response Time
    for (let i = 0; i < latestTen.length; i++) {
      list.push(
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td><p className="ellipsis" data-text={latestTen[i].query}>{latestTen[i].query.slice(0, 60)}</p></td>
          <td key={i + 1}>More Info</td>
          <td>{latestTen[i].queryTime}</td>
        </tr>
      )
    }

  }

  return (
    <div className="wide-container list-container">
      <h3>Query List</h3>
      <div>
        <table className = "query-list-table">
          <thead>
            <tr>
              <th key="ID">#</th>
              <th key="queryName">Query</th>
              <th key="queryDetails">Details</th>
              <th key="queryResTime">Resp. Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            {list}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QueryList;

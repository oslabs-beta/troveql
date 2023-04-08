import * as React from 'react';

function QueryList({ cacheData }) {
  let list = [];

  // If no data, display nothing and avoid a crash
  if (cacheData && cacheData.queries && cacheData.queries.length > 0) {

    // pass required info from cacheData to each row in table

    // slice out last 5 items in array
    const latestFive = cacheData.queries.slice(-5).reverse();

    // create row for each query cacheData in latestFive
    for (let i = 0; i < latestFive.length; i++) {
      list.push(
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td><p className="ellipsis" data-text={latestFive[i].query}>{latestFive[i].query.slice(0, 60)}</p></td>
          <td key={i + 1}>More Info</td>
          <td>{latestFive[i].queryTime}</td>
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

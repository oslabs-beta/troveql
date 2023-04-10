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
      const hitMiss = latestFive[i].cacheHit ? 'Hit' : 'Miss';

      list.push(
        <tr key={i + 1}>
          <td>{i + 1}</td>
          <td>
            <p className="ellipsis" data-text={latestFive[i].query}>
              {latestFive[i].query.slice(0, 60)}
            </p>
          </td>
          <td key={i + 1} style={{ textAlign: 'center' }}>
            {hitMiss}
          </td>
          <td style={{ textAlign: 'center' }}>{latestFive[i].queryTime}</td>
        </tr>
      );
    }
  }

  return (
    <div className="wide-container list-container">
      <h3>Query List</h3>
      <table className="query-list-table">
        <thead>
          <tr>
            <th key="ID" style={{ width: '3%' }}>
              #
            </th>
            <th key="queryName" style={{ width: '20%' }}>
              Query
            </th>
            <th key="queryHit" style={{ width: '3%' }}>
              Hit/Miss
            </th>
            <th key="queryResTime" style={{ width: '25%' }}>
              Resp. Time (ms)
            </th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </table>
    </div>
  );
}

export default QueryList;

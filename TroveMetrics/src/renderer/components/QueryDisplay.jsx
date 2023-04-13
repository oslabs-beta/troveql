import * as React from 'react';

function QueryDisplay({ cacheData }) {
  let vars = [];
  let query = '';

  // If no data, display nothing and avoid a crash
  if (cacheData && cacheData.queries && cacheData.queries.length > 0) {
    let variables = cacheData.queries[cacheData.queries.length - 1].variables;
    query = cacheData.queries[cacheData.queries.length - 1].query;

    for (const key in variables) {
      vars.push(
        <p key={key}>
          {key} : {variables[key]}
        </p>
      );
    }
  }

  return (
    <div className="small-container">
      <h3>Previous Query</h3>
      <h5>Query String</h5>
      <div className="query-display">{query}</div>
      <h5>Arguments</h5>
      <div id="arguments" className="query-display">
        {vars}
      </div>
    </div>
  );
}

export default QueryDisplay;

import * as React from 'react';

function QueryDisplay({ queries }) {
  let vars = [];
  let query;

  // At initial load with no data, no queries to load, so check for query
  if (queries && queries.length > 0) {
    let variables = queries[queries.length - 1].variables;
    query = queries[queries.length - 1].query;

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
      <h3>Last Query</h3>
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

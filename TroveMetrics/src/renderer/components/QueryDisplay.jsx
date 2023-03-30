import * as React from 'react';

function QueryDisplay({ queries }) {
  
  let { query, variables } = queries[queries.length - 1];
  
  let vars = [];
  for (const key in variables) {
    vars.push(
      <p key={key}>{key} : {variables[key]}</p>
    );
  };

  return (
    <div className="small-container">
      <h3>Last Query</h3>
      <h5>Query String</h5>
      <div className="query-display">
        {query}
      </div>
      <h5>Arguments</h5>
      <div id="arguments" className="query-display">
        {vars}
      </div>
    </div>
  )
}

export default QueryDisplay;
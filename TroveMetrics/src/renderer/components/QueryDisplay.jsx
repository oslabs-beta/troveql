import * as React from 'react';

function QueryDisplay({ query, variables }) {
  // return <p>QueryDisplay</p>

  const vars = [];
  for (const key in variables) {
    vars.push(
      <p key={key}>{key} : {variables[key]}</p>
    );
  };

  return (
    <div className="small-container">
      <h3>Most Recent</h3>
      <h5>Query</h5>
      <div className="query-display">
        {query}
      </div>
      <h5>Arguments</h5>
      <div className="query-display">
        {vars}
      </div>
    </div>
  )
}

export default QueryDisplay;
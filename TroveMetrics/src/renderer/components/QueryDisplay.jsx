import * as React from 'react';
import { Data } from '../../server/database/test';

function QueryDisplay({ data }) {
  // return <p>QueryDisplay</p>

  return (
    <div className="small-container">
      <h3>Last Query</h3>
      <div id="query-display">
        {data}
      </div>
    </div>
  )
}

export default QueryDisplay;
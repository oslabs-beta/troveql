import * as React from 'react';
import { Data } from '../../server/database/test';

function QueryDisplay({ data }) {
  // return <p>QueryDisplay</p>

  return (
    <div id="query-container">
      <h3 style={{ textAlign: "center" }}>QueryDisplay</h3>
      <p>Most Recent Query:</p>
      <p>
        {data}
      </p>
    </div>
  )
}

export default QueryDisplay;
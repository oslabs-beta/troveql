import * as React from 'react';
import { Data } from '../../server/database/data';

function QueryDisplay() {
  // return <p>QueryDisplay</p>
  const [queryData, setQueryData] = React.useState(Data.query);

  return (
    <div id="query-container">
      <h3 style={{ textAlign: "center" }}>QueryDisplay</h3>
      <p>Most Recent Query:</p>
      <p>
        {queryData}
      </p>
    </div>
  )
}

export default QueryDisplay;
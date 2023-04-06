import * as React from 'react';

function QueryTime ({ queries }) {
  const queryCount = queries.length;
  // console.log('QueryTime cacheData: ', queries[queryCount - 1].queryTime);

  return (
    <p>QueryTime: {queries[queryCount - 1].queryTime}</p>
  )
}

export default QueryTime;
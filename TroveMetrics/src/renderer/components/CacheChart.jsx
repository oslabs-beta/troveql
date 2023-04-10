import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss';

function CacheChart({ cacheData }) {
  let dataSet;

  // If no data, display 0, 0 and avoid a crash
  cacheData ? (dataSet = Object.values(cacheData.cache)) : (dataSet = [0, 0]);

  if (cacheData === undefined) {
  }

  const chartData = {
    labels: ['HIT', 'MISS'],
    datasets: [
      {
        label: 'Count',
        data: dataSet,
        backgroundColor: [variables.tertiary, variables.lightGray],
        //can add more style properties here like borderColor, borderWidth, etc.
      },
    ],
  };

  return (
    <div className="small-container grid-item">
      <h3>Cache Hits vs. Misses</h3>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: 'Cache Usage',
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'left',
            },
          },
        }}
      />
    </div>
  );
}

export default React.memo(CacheChart);

import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss';

function ARCData({ cacheData }) {
  // Set default values if no data
  let dataSet = null;
  let idealSize = '-';
  if (cacheData && cacheData.queries.length > 0) {
    const cacheSize = cacheData.queries.slice(-1)[0].cacheSize;
    const total = cacheData.capacity;
    const { t1, t2, p } = cacheSize;
    dataSet = [
      ((total - t1 - t2) / total) * 100,
      (t1 / total) * 100,
      (t2 / total) * 100,
    ];
    idealSize = p;
  } else {
    dataSet = [0, 0, 0];
  }

  // Setup chart data for Chart.js
  const chartData = {
    labels: ['Remaining', 'Recency', 'Frequency'],
    datasets: [
      {
        label: '%',
        data: dataSet,
        backgroundColor: [
          variables.lightGray,
          variables.primary,
          variables.secondary,
        ]
      },
    ],
  };

  return (
    <div className="small-container grid-item">
      <div id="rac-data-wrapper">
        <h3>Recency vs. Frequency</h3>
        <p id="ideal-size">Ideal Recency Cache Size: {idealSize} </p>
      </div>
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
              reverse: true,
            },
          },
        }}
      />
    </div>
  );
}

export default ARCData;

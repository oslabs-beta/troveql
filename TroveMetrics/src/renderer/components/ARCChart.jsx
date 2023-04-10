import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss';

function RACChart({ cacheData }) {
  let dataSet = null;

  // If no data, display 0, 0 and avoid a crash
  dataSet =
    cacheData && cacheData.queries.length > 0
      ? Object.values(
          cacheData.queries[cacheData.queries.length - 1].cacheSize
        ).map((value) => Math.abs(value))
      : [0, 0, 0, 0];

  const chartData = {
    labels: ['recency', 'frequency', 'rec.(ghost)', 'freq.(ghost)'],
    datasets: [
      {
        label: 'Count',
        // pass in props of cachesize
        data: dataSet,
        backgroundColor: [
          variables.primary,
          variables.secondary,
          variables.primaryLight,
          variables.secondaryLight,
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      },
    ],
  };

  return (
    <div className="small-container">
      <h3>ARC Cache Sizes</h3>
      <div className="chart-cont">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
              y: {
                ticks: {
                  stepSize: 1,
                },
                title: {
                  display: true,
                  text: 'Count(s)',
                },
              },
            },
            plugins: {
              title: {
                display: false,
                text: 'Cache Usage',
              },
              legend: {
                display: false,
                position: 'bottom',
                align: 'left',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default RACChart;

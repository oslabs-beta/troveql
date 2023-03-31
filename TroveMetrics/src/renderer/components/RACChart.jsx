import * as React from 'react';
import { Bar } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function RACChart({ cacheData }) {
let dataSet = null;

// If no data, display 0, 0 and avoid a crash
(cacheData && cacheData.queries.length > 0) ? 
dataSet = Object.values(cacheData.queries[cacheData.queries.length - 1].cacheSize) :
dataSet = [0, 0, 0, 0]

const chartData = {
  labels: ['T1', 'T2', 'B1', 'B2'],
  datasets: [
    {
      label: 'Count',
      // pass in props of cachesize
      data: dataSet,
      backgroundColor: [
        variables.orange, 
        variables.orange,
        variables.lightGray,
        variables.lightGray,
      ],
      //can add more style properties here like borderColor, borderWidth, etc.
    }
  ]
}





  return (
    <div className="small-container">
      <h3>RAC Counts</h3>
      <div className="chart-cont">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              y: {
                ticks: {
                  stepSize: 1,
                },
                title: {
                  display: true,
                  text: 'Count(s)'
                }
              }
            },
            plugins: {
              title: {
                display: false,
                text: "Cache Usage"
              },
              legend: {
                display: false,
                position: 'bottom',
                align: 'left',
              },
            }
          }}
        />
      </div>
    </div>
  );
}

export default RACChart;
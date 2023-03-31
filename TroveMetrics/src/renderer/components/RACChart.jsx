import * as React from 'react';
import { Bar } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function RACChart({ data }) {
  let graph = null;

  if (data) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Count',
        // pass in props of cachesize
        data: Object.values(data),
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
  graph = (
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
  )
}



  return (
    <div className="small-container">
      <h3>RAC Counts</h3>
      {graph}
    </div>
  );
}

export default RACChart;
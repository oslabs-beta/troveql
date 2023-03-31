import * as React from 'react';
import { Pie } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function CacheChart({ data }) {
  let dataSet;

  // If no data, display 0, 0 and avoid a crash
  data ? dataSet = Object.values(data) : dataSet = [0, 0]

  const chartData = {
    labels: ['HIT', 'MISS'],
    datasets: [
      {
        label: 'Count',
        data: dataSet,
        backgroundColor: [
          variables.orange, 
          variables.lightGray 
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      }
    ]
  }

  return (
    <div className="small-container">
      <h3>Latest Hit Rate</h3>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: "Cache Usage"
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'left',
            }
          }
        }}
      />
    </div>
  );
}

export default CacheChart;
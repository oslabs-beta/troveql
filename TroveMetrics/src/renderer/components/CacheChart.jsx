import * as React from 'react';
import { Pie } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function CacheChart({ data }) {

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Count',
        data: Object.values(data),
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
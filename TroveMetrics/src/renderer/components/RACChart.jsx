import * as React from 'react';
import { Bar } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function RACChart({ data }) {

  console.log('data', data);
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
          variables.lightGray 
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      }
    ]
  }
  graph = (
    <Bar
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
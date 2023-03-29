import * as React from 'react';
import { Line } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function TimeChart({ data }) {
  // return <p>QueryDisplay</p>



  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Count',
        data: Object.values(data),
        backgroundColor: [
          variables.orange, //green for HIT
          variables.lightGray //red for MISS
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      }
    ]
  }

  return (
    <div className="wide-container">
      <h3>CacheChart</h3>
      <Line
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

export default TimeChart
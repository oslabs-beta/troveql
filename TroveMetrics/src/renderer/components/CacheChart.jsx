import * as React from 'react';
import { Bar } from "react-chartjs-2";
import { Data } from '../../server/database/test';

function CacheChart({ data }) {
  // return <p>CacheChart</p>

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Cache Usage',
        data: Object.values(data),
        backgroundColor: [
          '#23C552', //green for HIT
          '#F84F31' //red for MISS
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      }
    ]
  }

  return (
    <div id="chart-container">
      <h3 style={{ textAlign: "center" }}>CacheChart</h3>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Cache Usage"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}

export default CacheChart;
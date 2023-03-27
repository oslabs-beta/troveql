import * as React from 'react';
import { Bar } from "react-chartjs-2";
import { Data } from '../../server/database/data';

function CacheChart() {
  // return <p>CacheChart</p>
  const [cacheData, setCacheData] = React.useState({
    labels: Data.cache.map((data) => data.type),
    datasets: [
      {
        label: 'Cache Usage',
        data: Data.cache.map((data) => data.value),
        backgroundColor: [
          '#23C552', //green for HIT
          '#F84F31' //red for MISS
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      }
    ]
  })

  return (
    <div id="chart-container">
      <h3 style={{ textAlign: "center" }}>CacheChart</h3>
      <Bar
        data={cacheData}
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
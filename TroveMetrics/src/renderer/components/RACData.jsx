import * as React from 'react';
import { Pie } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function RACData({ cacheData }) {
  console.log('data', cacheData)
  let dataSet = null;
  // data to implement
  // for label
    // p value  
  // for pie chart
    // T1 
    // T2
    // Total capacity
  let p = '-';
  if (cacheData && cacheData.queries.length > 0) {
    const cacheSize = cacheData.queries.slice(-1)[0].cacheSize;
    p = cacheSize.p;
    const total = cacheData.capacity;
    const { t1, t2 } = cacheSize;
    dataSet = [(total-t1-t2)/total*100, t1/total*100, t2/total*100];
  } else {
    dataSet = [0, 0, 0];
  }

  // (cacheData && cacheData.queries.length > 0) ? dataSet = [0, 0, 0] : dataSet = [total-t1-t2, t1, t2];

  // // If no data, display 0, 0 and avoid a crash
  // data ? dataSet = Object.values(data) : dataSet = [3, 3]
  // console.log('data', data);

  const chartData = {
    labels: ['Remaining Size', 'T1', 'T2'],
    datasets: [
      {
        label: '%',
        data: dataSet,
        backgroundColor: [
          variables.lightGray,
          variables.orange, 
          variables.orange,
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      }
    ]
  }

  return (
    <div className="small-container">
      <h3>RAC Size</h3>
      <div id="idealSize">
        <p>Ideal Size: {p} </p>
      </div>
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
            },
          }
        }}
      />
    </div>
  );
}

export default RACData;
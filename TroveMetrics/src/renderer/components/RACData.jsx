import * as React from 'react';
import { Pie } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function RACData({ cacheData }) {
  // Set default values if no data
  console.log('cachedata in RAC', cacheData);
  let dataSet = null;
  let idealSize = '-';
  if (cacheData && cacheData.queries.length > 0) {
    const cacheSize = cacheData.queries.slice(-1)[0].cacheSize;
    const total = cacheData.capacity;
    const { t1, t2, p } = cacheSize;
    dataSet = [(total-t1-t2)/total*100, t1/total*100, t2/total*100];
    idealSize = p;
  } else {
    dataSet = [0, 0, 0];
  }


  const chartData = {
    labels: ['Remaining Size', 'T1', 'T2'],
    datasets: [
      {
        label: '%',
        data: dataSet,
        backgroundColor: [
          variables.lightGray,
          variables.orange, 
          variables.lightOrange,
        ],
        //can add more style properties here like borderColor, borderWidth, etc.
      }
    ]
  }

  return (
    <div className="small-container">
      <div id="rac-data-wrapper">
        <h3>RAC Size</h3>
        <p id="ideal-size">Ideal T1 Size: {idealSize} </p>
      </div>
      <div id="rac-data">
        <Pie
          data={chartData}
          options={{
            responsive: true,
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
    </div>
  );
}

export default RACData;
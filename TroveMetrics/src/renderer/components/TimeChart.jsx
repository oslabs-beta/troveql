import * as React from 'react';
import { Line } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'


function TimeChart({ cacheData }) {
  const [timeChartData, setTimeChartData] = React.useState({
    //xValues: [new Date().toLocaleTimeString()],
    hitData: [{x: 0, y: cacheData.cache.HIT}],
    missData: [{x: 0, y: cacheData.cache.MISS}],
    startingTime: new Date()
  })

  React.useEffect(() => {
    const timeChange = (new Date() - timeChartData.startingTime)/1000;
    const newState = {...timeChartData};

    newState.hitData.push({x: timeChange, y: cacheData.cache.HIT});
    newState.missData.push({x: timeChange, y: cacheData.cache.MISS});

    setTimeChartData(newState)
  }, [cacheData])

    const chartData = {
    label: 'test',
    datasets: [
      {
        label: 'Hits',
        data: timeChartData.hitData,//JANKY SOLUTION
        fill: true,
        backgroundColor: [
          variables.orange, 
        ],
      },
      {
        label: 'Misses',
        data: timeChartData.missData, //JANKY SOLUTION
        fill: true,
        backgroundColor: [
          variables.lightGray 
        ],
      }
    ]
  }

  return (
    <div className="wide-container">
      <h3>Cache Hits</h3>
      <Line
        data={chartData}


        options={{
          responsive: true,
          plugins: {
            tooltip: {
              mode: 'index'
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'left',
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time'
              },
              type: 'linear'
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Total Queries'
              },
              beginAtZero: true
            }
          }
        }}

      />
    </div>
  );
}

export default TimeChart
import * as React from 'react';
import { Line } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'

function TimeChart({ cacheData }) {
  const [timeChartData, setTimeChartData] = React.useState({
    xValues: [new Date().toLocaleTimeString()],
    hitData: [cacheData.cache.HIT],
    missData: [cacheData.cache.MISS]
  })

  React.useEffect(() => {
    const newState = {...timeChartData};
    newState.xValues.push(new Date().toLocaleTimeString());
    newState.hitData.push(cacheData.cache.HIT);
    newState.missData.push(cacheData.cache.MISS);
    setTimeChartData(newState)
  }, [cacheData])

  const chartData = {
    labels: timeChartData.xValues.slice(2), //JANKY SOLUTION
    datasets: [
      {
        label: 'Hits',
        data: timeChartData.hitData.slice(2), //JANKY SOLUTION
        fill: true,
        backgroundColor: [
          variables.orange, 
        ],
      },
      {
        label: 'Misses',
        data: timeChartData.missData.slice(2), //JANKY SOLUTION
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
              }
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
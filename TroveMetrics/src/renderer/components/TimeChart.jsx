import * as React from 'react';
import { Line } from "react-chartjs-2";
import variables from '../styles/_variables.module.scss'


function TimeChart({ cacheData }) {
  const startingData = {
    hitData: [{x: 0, y: cacheData.cache.HIT}],
    missData: [{x: 0, y: cacheData.cache.MISS}],
    startingTime: new Date()
  }
  const [timeChartData, setTimeChartData] = React.useState(startingData)

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
        tension: 0.1,
        backgroundColor: [
          variables.orange, 
        ],
        pointRadius: 6,
      },
      {
        label: 'Misses',
        data: timeChartData.missData, //JANKY SOLUTION
        fill: true,
        tension: 0.1,
        backgroundColor: [
          variables.lightGray 
        ],
        pointRadius: 6,
      }
    ]
  }

  function handleTimeReset(e) {

    setTimeChartData(startingData)
  }

  return (
    <div className="wide-container">
      <div className="chart-header">
        <h3>Cache Hits</h3>
        <button onClick={handleTimeReset}>RESET TIME</button>
      </div>
      <div className="chart-cont">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
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
                  text: 'Time (s)'
                },
                type: 'linear',
                beginAtZero: true
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
    </div>
  );
}

export default TimeChart
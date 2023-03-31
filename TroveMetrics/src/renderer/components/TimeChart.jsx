import * as React from 'react';
import { Line } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss';

function TimeChart({ cacheData, status }) {
  const startingData = {
    hitData: [{ x: 0, y: cacheData.cache.HIT }],
    missData: [{ x: 0, y: cacheData.cache.MISS }],
    startingTime: null,
  };
  const [timeChartData, setTimeChartData] = React.useState(startingData);

  React.useEffect(() => {
    const newState = { ...timeChartData };
    if (!timeChartData.startingTime) {
      newState.startingTime = new Date();
    }
    const timeChange = (new Date() - newState.startingTime) / 1000;

    newState.hitData.push({ x: timeChange, y: cacheData.cache.HIT });
    newState.missData.push({ x: timeChange, y: cacheData.cache.MISS });

    setTimeChartData(newState);
  }, [cacheData]);

  const chartData = {
    label: 'test',
    datasets: [
      {
        label: 'Hits',
        data: timeChartData.hitData, //JANKY SOLUTION
        fill: true,
        tension: 0.1,
        backgroundColor: [variables.orange],
        pointRadius: 6,
      },
      {
        label: 'Misses',
        data: timeChartData.missData, //JANKY SOLUTION
        fill: true,
        tension: 0.1,
        backgroundColor: [variables.lightGray],
        pointRadius: 6,
      },
    ],
  };

  function handleTimeReset(e) {
    setTimeChartData(startingData);
  }

  React.useEffect(() => {
    console.log('in TimeCHart', status);
    if (status === 'clear') {
      console.log('clearing metrics in timeChart');

      setTimeChartData(startingData);
    }
  }, [status]);

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
                mode: 'index',
              },
              legend: {
                display: false,
                position: 'bottom',
                align: 'left',
              },
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false,
            },
            scales: {
              x: {
                title: {
                  display: true,

                  text: 'Time (seconds)',

                },
                type: 'linear',
                beginAtZero: true,
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: 'Total Queries',
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default TimeChart;

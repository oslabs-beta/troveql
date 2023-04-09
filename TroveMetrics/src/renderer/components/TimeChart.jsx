import * as React from 'react';
import { Line } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss';

function TimeChart({ cacheData, status }) {
  let startingData = null;

  const clearData = {
    hitData: [{ x: 0, y: 0 }],
    missData: [{ x: 0, y: 0 }],
    startingTime: null,
  };

  // If no data, display 0, 0 and avoid a crash
  if (cacheData && cacheData.cache) {
    startingData = {
      hitData: [{ x: 0, y: cacheData.cache.HIT }],
      missData: [{ x: 0, y: cacheData.cache.MISS }],
      startingTime: new Date(),
    };
  } else {
    startingData = clearData;
  }

  const [timeChartData, setTimeChartData] = React.useState(startingData);

  React.useEffect(() => {
    if (cacheData && cacheData.cache) {
      const newState = { ...timeChartData };
      if (!timeChartData.startingTime) {
        newState.startingTime = new Date();
      }
      const timeChange = (new Date() - newState.startingTime) / 1000;

      newState.hitData.push({ x: timeChange, y: cacheData.cache.HIT });
      newState.missData.push({ x: timeChange, y: cacheData.cache.MISS });

      setTimeChartData(newState);
    }
  }, [cacheData]);

  const chartData = {
    label: 'test',
    datasets: [
      {
        label: 'Hits',
        data: timeChartData.hitData,
        fill: true,
        tension: 0.1,
        backgroundColor: [variables.tertiary],
        pointRadius: 6,
      },
      {
        label: 'Misses',
        data: timeChartData.missData,
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
    if (status === 'clear') {
      console.log('clearing metrics in TimeChart');

      setTimeChartData(clearData);
    }
  }, [status]);

  return (
    <div className="wide-container">
      <div className="chart-header">
        <h3>Cache Hits</h3>
        <button className="button-metric" onClick={handleTimeReset}>
          RESET TIME
        </button>
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

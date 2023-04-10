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
      const { startingTime, hitData, missData } = timeChartData;
      const prevHit = hitData[hitData.length - 1].y;
      const prevMiss = missData[missData.length - 1].y;

      if (
        prevHit === cacheData.cache.HIT &&
        prevMiss === cacheData.cache.MISS
      ) {
        return;
      }

      const timeChange = (new Date() - (startingTime || new Date())) / 1000;

      setTimeChartData({
        ...timeChartData,
        startingTime: startingTime || new Date(),
        hitData: [...hitData, { x: timeChange, y: cacheData.cache.HIT }],
        missData: [...missData, { x: timeChange, y: cacheData.cache.MISS }],
      });
    }
  }, [cacheData, timeChartData]);

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
        <h3>Hits vs. Misses Over Time</h3>
        <button className="button-metric" onClick={handleTimeReset}>
          RESET TIME
        </button>
      </div>
      <Line
        data={chartData}
        options={{
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
  );
}

export default TimeChart;

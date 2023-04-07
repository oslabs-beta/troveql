import * as React from 'react';
import { Line } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss'

// what should the time be for mutations? currently it's null
// tooltip for the query?

function QueryTime ({ queries }) {
  const queryTimeData = [0];
  queries.forEach((queryObj) => queryTimeData.push(queryObj.queryTime));

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // title: (xDatapoint) => formatXValue(xDatapoint.raw),
          label: (context) => '',
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Query'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Time (milliseconds)'
        }
      },
    }
  };

  const data = {
    labels: Array.from(queryTimeData.keys()),
    datasets: [
      {
        label: 'Query Time (ms)',
        data: queryTimeData,
        borderColor: variables.orange
      }
    ]
  }

  return (
    <div className="wide-container">
      <div className="chart-header">
        <h3>Query Response Time</h3>
      </div>
      <div className="chart-cont">
        <Line options={options} data={data}/>
      </div>
    </div>
  )
}

export default QueryTime;
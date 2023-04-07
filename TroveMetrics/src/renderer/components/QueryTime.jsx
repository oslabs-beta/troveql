import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss'

// what should the time be for mutations? currently it's null
// when we hit the cache, with the bar chart v the line graph, it barely shows the time

function QueryTime ({ queries }) {
  const queryTimeData = [0];
  const barColors = [variables.lightGray];
  // using forEach to create new variables instead of map so that if there is no data then the chart will not break
  queries.forEach((queryObj) => {
    queryTimeData.push(queryObj.queryTime);
    if (queryObj.cacheHit) {
      barColors.push(variables.orange)
    } else {
      barColors.push(variables.lightGray)
    }
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context) => '',
          footer: (context) => 'Query String: ' + queries[context[0].dataIndex].query,
          afterFooter: (context) => 'Query Variables: ' + JSON.stringify(queries[context[0].dataIndex].variables)
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
          text: 'Response Time (milliseconds)',
        },
        // type: 'logarithmic',
      },
    }
  };

  const data = {
    labels: Array.from(queryTimeData.keys()),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: queryTimeData,
        backgroundColor: barColors
      }
    ]
  }

  return (
    <div className="wide-container">
      <div className="chart-header">
        <h3>Query Response Times</h3>
      </div>
      <div className="chart-cont">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default QueryTime;
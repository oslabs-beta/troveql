import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss'
import { query } from 'express';

// what should the time be for mutations? currently it's null
// tooltip for the query?

function QueryTime ({ queries }) {
  const queryTimeData = [0];
  queries.forEach((queryObj) => {
    queryTimeData.push(queryObj.queryTime);
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
          afterFooter: (context) => {
            const queryVariables = queries[context[0].dataIndex].variables;
            let variablesStr = '';
            for (const key in queryVariables) {
              variablesStr += key + ':' + queryVariables[key]
            }
            return 'Query Variables: ' + variablesStr;
          },
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
          text: 'Response Time (milliseconds)'
        }
      },
    }
  };

  const data = {
    labels: Array.from(queryTimeData.keys()),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: queryTimeData,
        backgroundColor: variables.orange
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
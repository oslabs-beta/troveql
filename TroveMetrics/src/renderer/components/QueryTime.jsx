import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import variables from '../styles/_variables.module.scss';

function QueryTime({ cacheData }) {
  // record the indices of Queries in the cacheData.queries array (skipping over Mutations) and their query time
  const queryIndex = [-1];
  const queryTime = [0];
  const barColors = [variables.lightGray];

  let queries = [];
  if (cacheData && cacheData.queries && cacheData.queries.length > 0) {
    queries = cacheData.queries;
    // using forEach to create new variables instead of map so that if there is no data then the chart will not break
    for (let i = 0; i < queries.length; i++) {
      // only record the data where there was a Query (skip over Mutations)
      if (queries[i].cacheHit !== null) {
        queryIndex.push(i);
        // normalize the data (+1) so that even if the queryTime was 0ms it can display a bar on the graph
        queryTime.push(queries[i].queryTime + 1);
        // display HITs in orange & MISSes in gray
        if (queries[i].cacheHit) {
          barColors.push(variables.tertiary);
        } else {
          barColors.push(variables.lightGray);
        }
      }
    }
  }

  // create a custom legend to overwrite the default
  const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart) {
      const chartLegend = document.getElementById('custom-chart-legend');
      if (!chartLegend.firstChild) {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        const boxSpan = document.createElement('span');
        boxSpan.style.display = 'inline-block';
        boxSpan.style.height = '10px';
        boxSpan.style.width = '40px';
        boxSpan.style.backgroundColor = variables.orange;
        li.appendChild(boxSpan);
        li.appendChild(document.createTextNode('Cache Hit'));
        ul.appendChild(li);

        chartLegend.appendChild(ul);
      }
    },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context) => '',
          footer: (context) =>
            'Query String: ' + queries[queryIndex[context[0].dataIndex]].query,
          afterFooter: (context) => {
            return queries[queryIndex[context[0].dataIndex]].variables
              ? 'Query Variables: ' +
                  JSON.stringify(
                    queries[queryIndex[context[0].dataIndex]].variables
                  )
              : '';
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Query',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Response Time (milliseconds)',
        },
        type: 'logarithmic',
      },
    },
  };

  const data = {
    labels: Array.from(queryTime.keys()),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: queryTime,
        backgroundColor: barColors,
      },
    ],
  };

  return (
    <div className="wide-container">
      <div className="chart-header">
        <h3>Query Response Times (+ 1 ms)</h3>
      </div>
      <div className="chart-cont">
        <div id="custom-chart-legend"></div>
        <Bar
          data={data}
          options={options}
          redraw={true}
          plugins={[htmlLegendPlugin]}
        />
      </div>
    </div>
  );
}

export default React.memo(QueryTime);

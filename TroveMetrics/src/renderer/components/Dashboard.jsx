import * as React from 'react';
import { Chart, CategoryScale } from 'chart.js/auto' //to pick specific chart features for bundle optimization (instead of using /auto): https://www.chartjs.org/docs/latest/getting-started/integration.html
import CacheChart from './CacheChart.jsx';
import QueryDisplay from './QueryDisplay.jsx';
import TimeChart from './TimeChart.jsx';

Chart.register(CategoryScale);

function Dashboard () {
  const [cacheData, setCacheData] = React.useState({
    cache: {
      'HIT': 0,
      'MISS': 0
    },
    queries: []
  })

  window.ipcRenderer.receive('data:udpate', (data) => {
    console.log(data)
    setCacheData(data)})

    ;

  return (
    <div id='dashboard'>
      <CacheChart data={cacheData.cache}/>
      <QueryDisplay query={cacheData.query} variables={cacheData.variables}/>
      <TimeChart data={cacheData.cache}/>
    </div>
  )
}

export default Dashboard;
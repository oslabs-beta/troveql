import * as React from 'react';
import { Chart, CategoryScale } from 'chart.js/auto' //to pick specific chart features for bundle optimization (instead of using /auto): https://www.chartjs.org/docs/latest/getting-started/integration.html
import CacheChart from './CacheChart.jsx';
import QueryDisplay from './QueryDisplay.jsx';
import TimeChart from './TimeChart.jsx';

Chart.register(CategoryScale);

function Dashboard () {
  // This tracks when renderer has received local data
  const [ready, setReady] = React.useState()
  // Main state for cache data
  const [cacheData, setCacheData] = React.useState()

  let charts = null

  // Use effect so that only one listener gets created
  React.useEffect(() => {
    window.ipcRenderer.receive('data:update', (data) => {
      setCacheData(data);
      setReady(true);
    })
  }, [])

  // Put any components that rely on the intial data pull here
  if (ready) {
    charts = [
      <CacheChart key="1" data={cacheData.cache}/>,
      <QueryDisplay key="2" queries={cacheData.queries}/>,
      <TimeChart key="3" cacheData={cacheData}/>
    ]
  }

  return (
    <div id='dashboard'>

      {charts}
    </div>
  )
}

export default Dashboard;
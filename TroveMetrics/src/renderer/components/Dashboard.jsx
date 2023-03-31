import * as React from 'react';
import { Chart, CategoryScale } from 'chart.js/auto'; //to pick specific chart features for bundle optimization (instead of using /auto): https://www.chartjs.org/docs/latest/getting-started/integration.html
import CacheChart from './CacheChart.jsx';
import QueryDisplay from './QueryDisplay.jsx';
import TimeChart from './TimeChart.jsx';
import RACChart from './RACChart.jsx';
import Header from './Header/Header.jsx';

Chart.register(CategoryScale);

function Dashboard() {
  // This tracks when renderer has received local data
  const [ready, setReady] = React.useState();
  // Main state for cache data
  const [cacheData, setCacheData] = React.useState();

  let charts = null;

  // Use effect on mount so that only one listener gets created
  React.useEffect(() => {
    // Ask for the data from local storage
    window.ipcRenderer.invoke('data:get').then((data) => {
      setCacheData(data);
      setReady(true);
    });

    // Create listener for pushes from server
    window.ipcRenderer.receive('data:update', (data) => {
      setCacheData(data);
    });
  }, []);

  
  // Put any components that rely on the intial data pull here
  if (ready) {
    console.log('DASHBOARD LOG OF LAST QUERY', cacheData.queries.slice(-1)[0].cacheSize)
    charts = [
      <CacheChart key="1" data={cacheData.cache} />,
      <QueryDisplay key="2" queries={cacheData.queries} />,
      <RACChart key="4" data={cacheData.queries.slice(-1)[0].cacheSize} />,
      <TimeChart key="3" cacheData={cacheData} />,
    ];
  }

  return (
    <div id="window">
      <Header />
      <div id="dashboard">{charts}</div>
    </div>
  );
}

export default Dashboard;

import * as React from 'react';
import { Chart, CategoryScale } from 'chart.js/auto'; //to pick specific chart features for bundle optimization (instead of using /auto): https://www.chartjs.org/docs/latest/getting-started/integration.html
import CacheChart from './CacheChart.jsx';
import QueryDisplay from './QueryDisplay.jsx';
import TimeChart from './TimeChart.jsx';
import RACChart from './RACChart.jsx';
import Header from './Header/Header.jsx';

Chart.register(CategoryScale);

function Dashboard() {
  // Main state for cache data
  const [cacheData, setCacheData] = React.useState();
  const [charts, setCharts] = React.useState([]);
  const [status, setStatus] = React.useState();

  // Use effect on mount so that only one listener gets created
  React.useEffect(() => {
    // Ask for the data from local storage
    window.ipcRenderer.invoke('data:get').then((data) => {
      setCacheData(data);
      setStatus('ready');
    });

    // Create listener for pushes from server
    window.ipcRenderer.receive('data:update', (data) => {
      setCacheData(data);
    });
  }, []);

  
  // Put any components that rely on the intial data pull here

  React.useEffect(() => {
    if (status === 'clear') {
      (async function fetchCacheData() {
        console.log('clearing metrics in dashboard');
        await window.ipcRenderer.invoke('data:clear').then((data) => {
          setCacheData(data);
          setCharts([
            <CacheChart key="1" data={cacheData.cache} />,
            <QueryDisplay key="2" queries={cacheData.queries} />,
            <TimeChart key="3" cacheData={cacheData} status={status} />,
            <RACChart key="4" data={cacheData.queries.slice(-1)[0].cacheSize} />,
          ]);
        });
        setStatus('ready');
      })();
    }

    if (status === 'ready') {
      setCharts([
        <CacheChart key="1" data={cacheData.cache} />,
        <QueryDisplay key="2" queries={cacheData.queries} />,
        <TimeChart key="3" cacheData={cacheData} status={status} />,
        <RACChart key="4" data={cacheData.queries.slice(-1)[0].cacheSize} />,
      ]);
    }
  }, [status, cacheData]);

  React.useEffect(() => {
    if (cacheData && status === 'clear') {
      setStatus('ready');
    }
  }, [cacheData, status]);


  return (
    <div id="window">
      <Header setStatus={setStatus} />
      <div id="dashboard">{charts}</div>
    </div>
  );
}

export default Dashboard;

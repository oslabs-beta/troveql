import * as React from 'react';
import { Chart, CategoryScale } from 'chart.js/auto'; //to pick specific chart features for bundle optimization (instead of using /auto): https://www.chartjs.org/docs/latest/getting-started/integration.html
import CacheChart from './CacheChart.jsx';
import QueryDisplay from './QueryDisplay.jsx';
import TimeChart from './TimeChart.jsx';
import RACChart from './RACChart.jsx';
import RACData from './RACData.jsx';
import Header from './Header/Header.jsx';
import QueryTime from './QueryTime.jsx';

Chart.register(CategoryScale);


function Dashboard() {
  // Main state for cache data
  const [cacheData, setCacheData] = React.useState();

  const [chartState, setChartState] = React.useState({
    CacheChart: {name: 'Current Hit Rate', display: true},
    QueryDisplay: {name: 'Last Query', display: true},
    TimeChart: {name: 'Hit Rate Over Time', display: true},
    RACChart: {name: 'RAC Info', display: true},
    RACData: {name: 'RAC Pie', display: true},
    QueryTime: {name: 'Query Times', display: true},
  })

  function renderCharts() {
    const chartDisplay = []

    if (chartState.CacheChart.display) chartDisplay.push(<CacheChart key='1' cacheData={cacheData} />)
    if (chartState.QueryDisplay.display) chartDisplay.push(<QueryDisplay key='2' cacheData={cacheData} />)
    if (chartState.RACChart.display) chartDisplay.push(<RACChart key='4' cacheData={cacheData} />)
    if (chartState.RACData.display) chartDisplay.push(<RACData key='5' cacheData={cacheData} />)
    if (chartState.TimeChart.display) chartDisplay.push(<TimeChart key='3' cacheData={cacheData} status={status}/>)
    if (chartState.QueryTime.display) chartDisplay.push(<QueryTime key='6' cacheData={cacheData} />)
    
    return chartDisplay
  }

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
        });
        setStatus('ready');
      })();
    }

    if (cacheData && (status === 'clear')) {
      setStatus('ready');
    }
  }, [status, cacheData]);

  return (
    <div id="window">
      <Header setStatus={setStatus} setChartState={setChartState} chartState={chartState}/>
      <div id="dashboard">
        {renderCharts()}
      </div>
    </div>
  );
}

export default Dashboard;

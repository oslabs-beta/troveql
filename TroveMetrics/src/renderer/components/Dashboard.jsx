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
    CacheChart: {name: 'Current Hit Rate', display: true, element: <CacheChart key='1' cacheData={cacheData} />},
    QueryDisplay: {name: 'Last Query', display: true, element: <QueryDisplay key='2' cacheData={cacheData} />},
    TimeChart: {name: 'Hit Rate Over Time', display: true, element: <TimeChart key='3' cacheData={cacheData} status={status} />},
    RACChart: {name: 'RAC Info', display: true, element: <RACChart key='4' cacheData={cacheData} />},
    RACData: {name: 'RAC Pie', display: true, element: <RACData key='5' cacheData={cacheData} />},
    QueryTime: {name: 'Query Times', display: false, element: <QueryTime key='6' cacheData={cacheData} />},
  })

  function renderCharts() {
    const chartDisplay = []
    for (const chart in chartState) {
      if (chartState[chart].display) chartDisplay.push(chartState[chart].element)
    }
    return chartDisplay
  }

  const [charts, setCharts] = React.useState(renderCharts());
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

  React.useEffect(() => {
    setCharts(renderCharts())
  }, [chartState])
  
  // Put any components that rely on the intial data pull here
  React.useEffect(() => {
    
    if (status === 'clear') {
      (async function fetchCacheData() {
        console.log('clearing metrics in dashboard');
        await window.ipcRenderer.invoke('data:clear').then((data) => {
          setCacheData(data);
          setCharts(renderCharts());
        });
        setStatus('ready');
      })();
    }

    if (status === 'ready') {
      setCharts(renderCharts());
    }
    if (cacheData && (status === 'clear')) {
      setStatus('ready');
    }
  }, [status, cacheData]);

  return (
    <div id="window">
      <Header setStatus={setStatus} setChartState={setChartState} chartState={chartState}/>
      <div id="dashboard">
        {charts}
      </div>
    </div>
  );
}

export default Dashboard;

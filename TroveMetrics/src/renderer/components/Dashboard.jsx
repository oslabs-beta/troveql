import * as React from 'react';
import { Chart, CategoryScale } from 'chart.js/auto'; //to pick specific chart features for bundle optimization (instead of using /auto): https://www.chartjs.org/docs/latest/getting-started/integration.html
import CacheChart from './CacheChart.jsx';
import QueryDisplay from './QueryDisplay.jsx';
import TimeChart from './TimeChart.jsx';
import RACChart from './ARCChart.jsx';
import RACData from './ARCData.jsx';
import QueryList from './QueryList.jsx';
import Header from './Header/Header.jsx';
import QueryTime from './QueryTime.jsx';

Chart.register(CategoryScale);

function Dashboard() {
  // Main state for cache data
  const [cacheData, setCacheData] = React.useState();
  const [configDisplay, setConfigDisplay] = React.useState(null);

  const [chartState, setChartState] = React.useState({
    CacheChart: { name: 'Cache Hits vs. Misses', display: true },
    QueryDisplay: { name: 'Previous Query', display: true },
    RACChart: { name: 'ARC Cache Sizes', display: true },
    RACData: { name: 'Recency vs. Frequency', display: true },
    QueryList: { name: 'Query List', display: true },
    TimeChart: { name: 'Hit vs. Misses Over Time', display: true },
    QueryTime: { name: 'Query Response Times', display: true },
  });

  function renderCharts() {
    const chartDisplay = [];

    if (chartState.CacheChart.display)
      chartDisplay.push(<CacheChart key="1" cacheData={cacheData} />);
    if (chartState.QueryDisplay.display)
      chartDisplay.push(<QueryDisplay key="2" cacheData={cacheData} />);
    if (chartState.RACChart.display)
      chartDisplay.push(<RACChart key="4" cacheData={cacheData} />);
    if (chartState.RACData.display)
      chartDisplay.push(<RACData key="5" cacheData={cacheData} />);
    if (chartState.QueryList.display)
      chartDisplay.push(<QueryList key="7" cacheData={cacheData} />);
    if (chartState.TimeChart.display)
      chartDisplay.push(
        <TimeChart key="3" cacheData={cacheData} status={status} />
      );
    if (chartState.QueryTime.display)
      chartDisplay.push(<QueryTime key="6" cacheData={cacheData} />);

    return chartDisplay;
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

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const configDisplayElement = document.getElementById('config-display');
      if (
        configDisplayElement &&
        !configDisplayElement.contains(event.target)
      ) {
        setConfigDisplay(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setConfigDisplay]);

  // Put any components that rely on the initial data pull here
  React.useEffect(() => {
    if (status === 'clear') {
      (async function fetchCacheData() {
        await window.ipcRenderer.invoke('data:clear').then((data) => {
          setCacheData(data);
        });
        setStatus('ready');
      })();
    }

    if (cacheData && status === 'clear') {
      setStatus('ready');
    }
  }, [status, cacheData]);

  return (
    <div id="window">
      <Header
        setStatus={setStatus}
        setChartState={setChartState}
        chartState={chartState}
        configDisplay={configDisplay}
        setConfigDisplay={setConfigDisplay}
      />
      <div id="dashboard">{renderCharts()}</div>
    </div>
  );
}

export default Dashboard;

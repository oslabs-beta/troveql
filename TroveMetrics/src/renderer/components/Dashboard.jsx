import * as React from 'react';
import { Chart, CategoryScale } from 'chart.js/auto' //to pick specific chart features for bundle optimization (instead of using /auto): https://www.chartjs.org/docs/latest/getting-started/integration.html
import CacheChart from './CacheChart.jsx';
import QueryDisplay from './QueryDisplay.jsx';

Chart.register(CategoryScale);

function Dashboard () {
  return (
    <div id='dashboard'>
      <CacheChart/>
      <QueryDisplay/>
    </div>
  )
}

export default Dashboard;
import * as React from 'react';
import TroveMetricsLogo from './TroveMetricsLogo.jsx';
import ClearButtons from './ClearButtons.jsx';
import CustomizeMetrics from './CustomizeMetrics.jsx'

function Header({ setStatus, setChartState , chartState}) {

  return (
    <div id="header">
      <TroveMetricsLogo />
      <ClearButtons setStatus={setStatus}/>
      <CustomizeMetrics setChartState={setChartState} chartState={chartState}/>
    </div>
  );
}

export default Header;

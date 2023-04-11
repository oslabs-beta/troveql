import * as React from 'react';
import TroveMetricsLogo from './TroveMetricsLogo.jsx';
import ClearButtons from './ClearButtons.jsx';
import CustomizeMetrics from './CustomizeMetrics.jsx';

function Header({
  setStatus,
  setChartState,
  chartState,
  configDisplay,
  setConfigDisplay,
}) {
  return (
    <div id="header">
      <TroveMetricsLogo />

      <div id="header-button-container">
        <CustomizeMetrics
          setChartState={setChartState}
          chartState={chartState}
          configDisplay={configDisplay}
          setConfigDisplay={setConfigDisplay}
        />
        <ClearButtons setStatus={setStatus} />
      </div>
    </div>
  );
}

export default Header;

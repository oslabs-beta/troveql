import React from 'react';
import icons from './icons.jsx';

function CustomizeMetrics({
  setChartState,
  chartState,
  configDisplay,
  setConfigDisplay,
}) {
  // Set whether to display config panel
  const defaultConfigButton = { text: 'CONFIG DISPLAY' };

  const [configButton, setConfigButton] = React.useState(defaultConfigButton);
  const onConfigDisplay = (e) => {
    if (configButton.text === 'CONFIG DISPLAY') {
      let chartCheckBoxes = [];
      for (const chart in chartState) {
        chartCheckBoxes.push(
          <label key={chart} htmlFor={chart}>
            <input
              id={chart}
              type="checkbox"
              defaultChecked={chartState[chart].display}
              onChange={onTick}
              name={chart}
            />
            {chartState[chart].name}
          </label>
        );
      }

      setConfigDisplay(<div id="config-display">{chartCheckBoxes}</div>);
    } else {
      setConfigDisplay(null);
      setConfigButton(defaultConfigButton);
    }
  };

  function onTick(e) {
    setChartState((prevState) => {
      const chartStateCopy = { ...prevState };
      const thisChartStateCopy = { ...chartStateCopy[e.target.id] };
      thisChartStateCopy.display = e.target.checked;
      chartStateCopy[e.target.id] = thisChartStateCopy;
      return chartStateCopy;
    });
  }

  return (
    <div id="config-cont">
      <button onClick={onConfigDisplay} className="button-header">
        {icons.setDashbaord}
        {configButton.text}
      </button>
      {configDisplay}
    </div>
  );
}

export default CustomizeMetrics;

import * as React from 'react';

function CustomizeMetrics({setChartState, chartState }) {
  // Set whether to display config panel
  const defaultConfigButton = {text: 'CONFIG DISPLAY'}

  const [configButton, setConfigButton] = React.useState(defaultConfigButton)
  const [configDisplay, setConfigDisplay] = React.useState(null)

  const onConfigDisplay = (e) => {
    if (configButton.text === 'CONFIG DISPLAY') {
      
      let chartCheckBoxes = [];
      for (const chart in chartState) {
        chartCheckBoxes.push(
          <label key={chart} htmlFor={chart}>
            <input id={chart} type="checkbox" defaultChecked={chartState[chart].display} onChange={onTick} name={chart}/>
            {chartState[chart].name}
          </label>
        )
      }
      setConfigDisplay(
        <div id="config-display">
        {chartCheckBoxes}
        </div>
        )
      setConfigButton({text: 'ACCEPT DISPLAY'})
    } else {
      setConfigDisplay(null)
      setConfigButton(defaultConfigButton)
    }
  }

  function onTick(e) {

    const chartStateCopy = {...chartState}
    const thisChartStateCopy = {...chartStateCopy[e.target.id]}
    thisChartStateCopy.display = e.target.checked;
    chartStateCopy[e.target.id] = thisChartStateCopy;

    // console.log('ALL STATE', chartStateCopy)
    // console.log('STATE', chartState)
    // console.log(setChartState)
    setChartState(chartStateCopy)
  }

  return (
    <div id='config-cont'>
      <button onClick={onConfigDisplay}>
        {configButton.text}
      </button>
      {configDisplay}
    </div>
  );
}

export default CustomizeMetrics;

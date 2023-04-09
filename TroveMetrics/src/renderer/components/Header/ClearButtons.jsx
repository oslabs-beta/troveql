import * as React from 'react';
import icons from './icons.jsx';

function ClearButtons({ setStatus }) {
  const onClearMetrics = () => {
    setStatus('clear');
  };

  const onClearCache = () => {
    setStatus('clear');
    window.ipcRenderer.send('cache:clear');
  };

  return (
    <div id="clear-buttons-container">
      <button onClick={onClearMetrics} className="button-header">
        {icons.clearGraphIcon}
        CLEAR METRICS
      </button>
      <button onClick={onClearCache} className="button-header">
        {icons.clearCacheIcon}
        CLEAR CACHE
      </button>
    </div>
  );
}

export default ClearButtons;

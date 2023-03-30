import * as React from 'react';
import TroveMetricsLogo from './TroveMetricsLogo.jsx';
import ClearButtons from './ClearButtons.jsx';

function Header() {
  return (
    <div id="header">
      <TroveMetricsLogo />
      <ClearButtons />
    </div>
  );
}

export default Header;

import * as React from 'react';
import TroveMetricsLogo from './TroveMetricsLogo.jsx';
import ClearButtons from './ClearButtons.jsx';

function Header({ setStatus }) {
  return (
    <div id="header">
      <TroveMetricsLogo />
      <ClearButtons setStatus={setStatus} />
    </div>
  );
}

export default Header;

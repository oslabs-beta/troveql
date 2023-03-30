import * as React from 'react';

function ClearButtons() {
  const onClearMetrics = () => {
    console.log('clearing metrics');
  };
  const cacheIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon"
      fill="white"
      height="1.2rem"
      viewBox="0 96 960 960"
    >
      <path d="M640 536q17 0 28.5-11.5T680 496q0-17-11.5-28.5T640 456q-17 0-28.5 11.5T600 496q0 17 11.5 28.5T640 536ZM320 436h200v-60H320v60ZM180 936q-34-114-67-227.5T80 476q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720 236q0 6-1.5 12t-3.5 11q-4 11-7.5 22.5T702 305l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Zm45-60h115v-80h200v80h115l63-210 102-35V456h-52L640 328q1-25 6.5-48.5T658 232q-38 10-72 29.5T534 316H300q-66.286 0-113.143 46.857T140 476q0 103.158 29 201.579T225 876Zm255-322Z" />
    </svg>
  );

  const chartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon"
      fill="white"
      height="1.2rem"
      viewBox="0 96 960 960"
    >
      <path d="M120 936v-76l60-60v136h-60Zm165 0V700l60-60v296h-60Zm165 0V640l60 61v235h-60Zm165 0V701l60-60v295h-60Zm165 0V540l60-60v456h-60ZM120 700v-85l280-278 160 160 280-281v85L560 582 400 422 120 700Z" />
    </svg>
  );

  return (
    <div id="button-container">
      <button onClick={onClearMetrics}>
        {chartIcon}
        CLEAR METRICS
      </button>
      <button>
        {cacheIcon}
        CLEAR CACHE
      </button>
    </div>
  );
}

export default ClearButtons;

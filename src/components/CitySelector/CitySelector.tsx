import React from 'react';
import './CitySelector.scss';

function CitySelector() {
  return (
    <div className="CitySelector">
      <input id="city-selector" type="text" placeholder="Type to filter by city name or country"/>
    </div>
  );
}

export default CitySelector;
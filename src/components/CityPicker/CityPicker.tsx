import React, { SyntheticEvent } from 'react';
import './CityPicker.scss';

export default function CitySelector() {
  function handleChange(e: SyntheticEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    console.log(value);
  };

  function handleFocus(e: SyntheticEvent<HTMLInputElement>) {
    console.log('CALL API');
  }

  return (
    <div className="CityPicker">
      <input
        id="city-picker"
        type="text"
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder="Type to filter by city name or country"
      />
    </div>
  );
}
import { useDispatch, useSelector } from 'react-redux';
import React, { SyntheticEvent, useState, useCallback } from 'react';
import './CityPicker.scss';
import { getCities, getFilteredCities } from '../../actions/cities';
import { RootState } from '../../types/RootState';
import debounce from 'lodash.debounce';

const CityPicker =  () => {
  const cities = useSelector((state:RootState) => state.citiesState.cities);
  const [searchText, updateSearchText] = useState('');
  const dispatch = useDispatch();

  const handleTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    updateSearchText(e.currentTarget.value);
    debouncedTextUpdate(searchText);
  }

  const debouncedTextUpdate = useCallback(
		debounce((searchText:string) => dispatch(getFilteredCities(searchText)), 1000),
		[], // will be created only once initially
	);

  function handleFocus(e: SyntheticEvent<HTMLInputElement>) {
    if (!searchText) {
      dispatch(getCities());
    }
  }

  return (
    <div className="CityPicker">
      <input
        id="city-picker"
        type="text"
        onFocus={handleFocus}
        onChange={handleTextChange}
        value={searchText}
        placeholder="Type to filter by city name or country"
      />
      {cities.map(city => (<p>{city.name}</p>))}
    </div>
  );
}

export default CityPicker;
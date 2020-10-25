import { useDispatch, useSelector } from 'react-redux';
import React, { SyntheticEvent, useState, useMemo } from 'react';
import { RootState } from '../../types/RootState';
import { getCities, getFilteredCities } from '../../actions/cities';
import './CityPicker.scss';

import debounce from 'lodash.debounce';
import CityList from '../ResultsPanel/CityList';

const CityPicker =  () => {
  const [searchText, updateSearchText] = useState('');
  const isLoading = useSelector((state:RootState) => state.citiesState.isLoading);
  const cities = useSelector((state:RootState) => state.citiesState.cities);
  const dispatch = useDispatch();

  const handleTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    updateSearchText(e.currentTarget.value);
    debouncedTextUpdate(e.currentTarget.value);
  }

  const debouncedTextUpdate = useMemo(
		() => debounce((searchText:string) => dispatch(getFilteredCities(searchText)), 1000),
		[dispatch],
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
      {isLoading && (<img src="/loading.gif" alt="loading"/>)}
      {cities.length > 0 && <CityList></CityList>}
    </div>
  );
}

export default CityPicker;
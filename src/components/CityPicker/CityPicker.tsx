import { useDispatch, useSelector } from 'react-redux';
import React, { SyntheticEvent, useState, useEffect, useCallback, useRef } from 'react';
import { RootState } from '../../types/RootState';
import { getCities, getFilteredCities } from '../../actions/cities';
import './CityPicker.scss';
import CityList from '../CityList/CityList';
import useDebounce from '../../hooks/useDebounce';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const CityPicker =  () => {
  const cityPicker = useRef<HTMLDivElement>(null);
  const [searchText, updateSearchText] = useState<string | undefined>(undefined);
  const [showResultsPanel, toggleResultsPanel] = useState(false);
  const debouncedText = useDebounce(searchText, 500);
  const isLoading = useSelector((state:RootState) => state.citiesState.isLoading);
  const cities = useSelector((state:RootState) => state.citiesState.cities);
  const dispatch = useDispatch();

  const clickOutside = useCallback(() => {
    toggleResultsPanel(false);
}, []);

  useOnClickOutside(cityPicker, clickOutside);

  useEffect(() => {
    if (debouncedText !== undefined) {
      dispatch(getFilteredCities(debouncedText));
    }
  }, [debouncedText, dispatch]);

  const handleTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    updateSearchText(e.currentTarget.value);
  };

  const handleFocus = () => {
    toggleResultsPanel(true);
    if (!searchText && !cities.length) {
      dispatch(getCities());
    }
  }

  return (
    <div ref={cityPicker} className="CityPicker">
      <input
        id="city-picker"
        type="text"
        onFocus={handleFocus}
        onChange={handleTextChange}
        autoComplete="off"
        value={searchText}
        placeholder="Type to filter by city name or country"
      />
      {isLoading && (<img src="/loading.gif" alt="loading"/>)}
      {(cities.length > 0 && showResultsPanel) && <CityList cities={cities}></CityList>}
    </div>
  );
}

export default CityPicker;
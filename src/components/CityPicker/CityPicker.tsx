import { useDispatch, useSelector } from 'react-redux';
import React, { SyntheticEvent, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { RootState } from '../../types/RootState';
import { getCities, getFilteredCities } from '../../actions/cities';
import './CityPicker.scss';
import debounce from 'lodash.debounce';
import CityList from '../CityList/CityList';

const CityPicker =  () => {
  const cityPicker = useRef<HTMLDivElement>(null);
  const [searchText, updateSearchText] = useState('');
  const [showResultsPanel, toggleResultsPanel] = useState(false);
  const isLoading = useSelector((state:RootState) => state.citiesState.isLoading);
  const cities = useSelector((state:RootState) => state.citiesState.cities);
  const dispatch = useDispatch();

  const clickOutside = useCallback((e: MouseEvent) => {
    if (cityPicker && cityPicker.current && !cityPicker.current.contains(e.target as Element)) {
      toggleResultsPanel(false);
    }
  }, [cityPicker]);

  useEffect(() => {
    document.addEventListener('click', clickOutside);
  }, [clickOutside]);

  const handleTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    updateSearchText(e.currentTarget.value);
    debouncedTextUpdate(e.currentTarget.value);
  };

  const handleFocus = () => {
    toggleResultsPanel(true);
    if (!searchText && !cities.length) {
      dispatch(getCities());
    }
  }

  const filterCities = useCallback((searchText:string) => {
    dispatch(getFilteredCities(searchText));
  }, [dispatch]);

  const debouncedTextUpdate = useMemo(
    () => debounce(filterCities, 500),
    [filterCities]
  );

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
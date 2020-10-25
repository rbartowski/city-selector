import { useDispatch, useSelector } from 'react-redux';
import React, { SyntheticEvent, useState, useMemo, useEffect, useCallback } from 'react';
import { RootState } from '../../types/RootState';
import { getCities, getFilteredCities } from '../../actions/cities';
import './CityPicker.scss';

import debounce from 'lodash.debounce';
import CityList from '../ResultsPanel/CityList';

const CityPicker =  () => {
  const cityPicker = React.createRef<HTMLDivElement>();
  const [searchText, updateSearchText] = useState('');
  const [showResultsPanel, toggleResultsPanel] = useState(false);
  const isLoading = useSelector((state:RootState) => state.citiesState.isLoading);
  const cities = useSelector((state:RootState) => state.citiesState.cities);
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener('click', (e:MouseEvent) => {
      if (cityPicker && cityPicker.current && !cityPicker.current.contains(e.target as Element)) {
        toggleResultsPanel(false);
      }
    });
  }, [cityPicker]);

  const handleTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    updateSearchText(e.currentTarget.value);
    debouncedTextUpdate(e.currentTarget.value);
  };

  const handleFocus = (e: SyntheticEvent<HTMLInputElement>) => {
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
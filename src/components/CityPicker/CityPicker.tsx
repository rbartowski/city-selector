import { useDispatch, useSelector } from 'react-redux';
import React, { SyntheticEvent, useState, useEffect, useCallback, useRef } from 'react';
import { RootState } from '../../types/RootState';
import { getCities, getFilteredCities, getPreferredCities } from '../../actions/cities';
import './CityPicker.scss';
import CityList from '../CityList/CityList';
import useDebounce from '../../hooks/useDebounce';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import CitySelected from '../CitySelected/CitySelected';
import { isLoadingSelector } from '../../selectors/cities';

const CityPicker =  () => {
  const isLoading = useSelector(isLoadingSelector);
  const preferredCities = useSelector((state: RootState) => state.citiesState.preferredCities);
  const pagination = useSelector((state:RootState) => state.citiesState.pagination);
  const preferredError = useSelector((state:RootState) => state.citiesState.preferredError);
  const citiesError = useSelector((state:RootState) => state.citiesState.citiesError);
  const updateError = useSelector((state:RootState) => state.citiesState.updateError);

  // Results panel
  const cityPicker = useRef<HTMLDivElement>(null);
  const [showResultsPanel, toggleResultsPanel] = useState(false);
  const clickOutside = useCallback(() => {
    toggleResultsPanel(false);
  }, []);

  useOnClickOutside(cityPicker, clickOutside);

  // Text input key stroke
  const [searchText, updateSearchText] = useState<string | undefined>(undefined);
  const debouncedText = useDebounce(searchText, 500);
  const dispatch = useDispatch();

  const handleTextChange = (e: SyntheticEvent<HTMLInputElement>) => {
    updateSearchText(e.currentTarget.value);
  };

  useEffect(() => {
    if (debouncedText !== undefined) {
      dispatch(getFilteredCities(debouncedText));
    }
  }, [debouncedText, dispatch]);

  // Text input focus
  const cities = useSelector((state:RootState) => state.citiesState.cities);
  const handleFocus = () => {
    toggleResultsPanel(true);
    if (!searchText && !cities.length) {
      dispatch(getPreferredCities());
      dispatch(getCities());
    } else if (preferredError) {
      dispatch(getPreferredCities());
    } else if(citiesError) {
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
      <div className="CityPicker__bottomPanel">
        {!!(preferredError || updateError || citiesError) &&
          <div className="CityPicker__error">
            {preferredError && <p>Error fetching your preferences. Please try again</p>}
            {updateError && <p>Error updating your preferences. Please try again</p>}
            {citiesError && <p>Error fetching cities. Please try again</p>}
          </div>}
        {preferredCities.length > 0 && <CitySelected preferredCities={preferredCities} />}
        {(cities.length > 0 && showResultsPanel) &&
          <CityList
            cities={cities}
            preferredCities={preferredCities}
            isLoading={isLoading}
            pagination={pagination}
            searchTerm={searchText}
          />
        }
      </div>
    </div>
  );
}

export default CityPicker;
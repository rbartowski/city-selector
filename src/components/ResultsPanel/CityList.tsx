import React, { SyntheticEvent, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CityItem from './CityItem';
import { RootState } from '../../types/RootState';
import './CityList.scss';
import throttle from 'lodash.throttle';
import { getCities } from '../../actions/cities';

const CityList =  () => {
  const cityList = React.createRef<HTMLDivElement>();
  const [scrollPosition, updateScrollPosition] = useState(0);
  const cities = useSelector((state:RootState) => state.citiesState.cities);
  const isLoading = useSelector((state:RootState) => state.citiesState.isLoading);
  const dispatch = useDispatch();

  const handleScroll = (e: SyntheticEvent<HTMLDivElement>) => {
    debouncedScrollUpdate(e.currentTarget.scrollTop, scrollPosition, isLoading);
  };

  const calculateScrollParams = (newPos: number, oldPos: number, isLoading: boolean) => {
    updateScrollPosition(newPos);
    if (newPos > oldPos && !isLoading) {
      dispatch(getCities(true));
    }
  }

  const debouncedScrollUpdate = useMemo(
    () => throttle(calculateScrollParams, 800),
    [],
  );

  return (
    <div ref={cityList} onScroll={handleScroll} className="CityList">
      {cities.map(city => (
        <CityItem key={city.geonameid} city={city} isChecked={false}></CityItem>
      ))}
    </div>
  );
};

export default CityList;
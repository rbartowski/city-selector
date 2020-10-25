import React, { RefObject, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CityItem from './CityItem';
import { RootState } from '../../types/RootState';
import './CityList.scss';
import throttle from 'lodash.throttle';
import { getCities } from '../../actions/cities';
import City from '../../types/City';

type CityListProps = {
  cities: City[]
}

const CityList =  (props: CityListProps) => {
  const cityList = useRef<HTMLDivElement>(null);
  const isLoading = useSelector((state:RootState) => state.citiesState.isLoading);
  const currentPage = useSelector((state:RootState) => state.citiesState.pagination.currentPage);
  const [scrollAmount, setScrollAmount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentPage === 0) {
      cityList?.current?.scroll(0, 0);
    }
  }, [currentPage])

  const handleScroll = (e: SyntheticEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < scrollAmount) {
      setScrollAmount(e.currentTarget.scrollTop);
      return;
    }
    throttledScrollUpdate(e.currentTarget.scrollTop, currentPage, isLoading, cityList);
  };

  const calculateScrollParams = useCallback((newPos: number,
      currentPage: number,
      isLoading: boolean,
      cityList: RefObject<HTMLDivElement>) => {
    const scrollPageOffset = 200; // height of the 4 first items (50px * 4)
    const pageHeight = cityList && cityList.current ? cityList.current.clientHeight * 2 : 500;
    const scrollPageAmount = scrollPageOffset + currentPage * pageHeight;

    setScrollAmount(newPos);

    if (newPos > scrollPageAmount && !isLoading) {
      dispatch(getCities(true));
    }
  }, [dispatch]);

  const throttledScrollUpdate = useMemo(
    () => throttle(calculateScrollParams, 500),
    [calculateScrollParams]
  );

  return (
    <div ref={cityList} onScroll={handleScroll} className="CityList">
      {props.cities.map(city => (
        <CityItem key={city.geonameid} city={city} isChecked={false}></CityItem>
      ))}
    </div>
  );
};

export default CityList;
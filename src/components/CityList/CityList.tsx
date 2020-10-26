import React, { RefObject, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import throttle from 'lodash.throttle';
import { getCities } from '../../actions/cities';
import CityListItem from './CityListItem';
import { RootState } from '../../types/RootState';
import City from '../../types/City';
import './CityList.scss';

type CityListProps = {
  cities: City[]
}

const CityList =  (props: CityListProps) => {
  const cityList = useRef<HTMLDivElement>(null);
  const isLoading = useSelector((state:RootState) => state.citiesState.isLoading);
  const pagination = useSelector((state:RootState) => state.citiesState.pagination);
  const [scrollAmount, setScrollAmount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (pagination.currentPage === 0) {
      cityList?.current?.scroll(0, 0);
    }
  }, [pagination])

  const handleScroll = (e: SyntheticEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < scrollAmount || !pagination.next || isLoading) {
      setScrollAmount(e.currentTarget.scrollTop);
      return;
    }
    throttledScrollUpdate(e.currentTarget.scrollTop, pagination.currentPage, cityList);
  };

  const calculateScrollParams = useCallback((newPos: number,
      currentPage: number,
      cityList: RefObject<HTMLDivElement>) => {
    const scrollPageOffset = 200; // height of the first 4 items (50px * 4)
    const pageHeight = cityList && cityList.current ? cityList.current.clientHeight * 2 : 500;
    const scrollPageAmount = scrollPageOffset + currentPage * pageHeight;

    setScrollAmount(newPos);

    if (newPos > scrollPageAmount) {
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
        <CityListItem key={city.geonameid} city={city} isChecked={false}></CityListItem>
      ))}
    </div>
  );
};

export default CityList;
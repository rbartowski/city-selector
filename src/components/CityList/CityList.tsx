import React, { RefObject, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCities } from '../../actions/cities';
import CityListItem from './CityListItem';
import City from '../../types/City';
import './CityList.scss';
import useThrottle from '../../hooks/useThrottle';
import { Pagination } from '../../types/Pagination';

type CityListProps = {
  cities: City[],
  preferredCities: City[],
  isLoading: boolean,
  pagination: Pagination,
  searchTerm: string | undefined
}

const CityList =  (props: CityListProps) => {
  const {pagination, isLoading, cities, preferredCities, searchTerm} = props;

  const [preferredCitiesIds, setPreferredIds] = useState(preferredCities.map(city => city.geonameid));
  useEffect(() => {
    setPreferredIds(preferredCities.map(city => city.geonameid));
  }, [preferredCities]);

  const cityList = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [scrollAmount, setScrollAmount] = useState(0);
  const throttledScrollAmount = useThrottle(scrollAmount, 500);

  const handleScroll = (e: SyntheticEvent<HTMLDivElement>) => {
    setScrollAmount(e.currentTarget.scrollTop);
  };

  /* each scrolling page (10 items) is the list container client height * 2,
      and the offset is the height of the first 4 items. This method will trigger a fetch whenever we're scrolling down
      and  we're positioned 2 items before the page end */
  const calculateScrollParams = useCallback((newPos: number, currentPage: number, cityList: RefObject<HTMLDivElement>) => {
    const scrollPageOffset = 150;
    const pageHeight = cityList && cityList.current ? cityList.current.clientHeight * 2 : 500;
    const scrollPageAmount = scrollPageOffset + currentPage * pageHeight;

    setScrollAmount(newPos);

    if (newPos > scrollPageAmount) {
      dispatch(getCities(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (pagination.currentPage === 0) {
      cityList?.current?.scroll(0, 0);
    }
  }, [pagination]);

  useEffect(() => {
    if (scrollAmount > throttledScrollAmount && !isLoading && pagination.next) {
      calculateScrollParams(scrollAmount, pagination.currentPage, cityList);
    }
  }, [throttledScrollAmount, scrollAmount, isLoading, pagination, calculateScrollParams]);

  return (
    <div ref={cityList} onScroll={handleScroll} className="CityList">
      {cities.map(city => (
        <CityListItem
          key={city.geonameid}
          city={city}
          isChecked={preferredCitiesIds.includes(city.geonameid)}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
};

export default CityList;
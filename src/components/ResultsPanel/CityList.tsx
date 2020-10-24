import React from 'react';
import { useSelector } from 'react-redux';
import CityItem from './CityItem';
import { RootState } from '../../types/RootState';
import './CityList.scss';

const CityList =  () => {
  const cities = useSelector((state:RootState) => state.citiesState.cities);

  return (
    <div className="CityList">
      {cities.map(city => (
        <CityItem key={city.geonameid} city={city} isChecked={false}></CityItem>
      ))}
    </div>
  );
};

export default CityList;
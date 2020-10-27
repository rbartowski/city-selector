import React from 'react';
import { useDispatch } from 'react-redux';
import { updatePreferredCities } from '../../actions/cities';
import PreferredCitiesPatch from '../../types/PreferredCitiesPatch';
import './CitySelected.scss';

type CitySelectedProps = {
  preferredCities: number[]
}

const CityListSelected =  (props: CitySelectedProps) => {
  const dispatch = useDispatch();

  const handleRemoveClick = (cityId: number) => {
    const payload: PreferredCitiesPatch = {[cityId.toString()]: false};
    dispatch(updatePreferredCities(payload));
  };

  return (
    <div className="CitySelected">
      {props.preferredCities.map(city => (
        <div className="CitySelected__badge" key={city}>
          {city}
          <span onClick={() => handleRemoveClick(city)}>X</span>
        </div>
      ))}
    </div>
  );
}

export default CityListSelected;
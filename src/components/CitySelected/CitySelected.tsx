import React from 'react';
import { useDispatch } from 'react-redux';
import { updatePreferredCities } from '../../actions/cities';
import City from '../../types/City';
import './CitySelected.scss';

type CitySelectedProps = {
  preferredCities: City[]
}

const CityListSelected =  (props: CitySelectedProps) => {
  const dispatch = useDispatch();
  const handleRemoveClick = (city: City) => {
    const payload: City[] = [{
      ...city,
      selected: false
    }];
    dispatch(updatePreferredCities(payload));
  };

  return (
    <div className="CitySelected">
      {props.preferredCities.map(city => (
        <div className="CitySelected__badge" key={city.geonameid}>
          {city.name} - {city.subcountry || city.country}
          <span onClick={() => handleRemoveClick(city)}>X</span>
        </div>
      ))}
    </div>
  );
}

export default CityListSelected;
import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePreferredCities } from '../../actions/cities';
import City from '../../types/City';
import PreferredCitiesPatch from '../../types/PreferredCitiesPatch';
import './CityListItem.scss';

type CityProps = {
  city: City,
  isChecked: boolean
}

const CityListItem =  (props: CityProps) => {
  const { city, isChecked } = props;
  const [InputChecked, updateChecked] = useState(isChecked);
  const dispatch = useDispatch();

  const handleInputChange = (e: SyntheticEvent<HTMLInputElement>, cityId: number) => {
    updateChecked(e.currentTarget.checked);
    const payload: PreferredCitiesPatch = {[cityId.toString()]: e.currentTarget.checked};
    dispatch(updatePreferredCities(payload));
  }

  return (
    <div key={city.geonameid} className="CityListItem">
      <div className="CityListItem__description">
        <p className="CityListItem__description-name">{city.name}</p>
        <p className="CityListItem__description-country">{city.subcountry + '- '}{city.country}</p>
      </div>
      <div className="CityListItem__actions">
        <input type="checkbox"
               onChange={(e: SyntheticEvent<HTMLInputElement>) => handleInputChange(e, city.geonameid)}
               checked={InputChecked}/>
      </div>
    </div>
  );
};

export default CityListItem;
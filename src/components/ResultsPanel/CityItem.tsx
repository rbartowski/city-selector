import React, { SyntheticEvent, useState } from 'react';
import City from '../../types/City';
import './CityItem.scss';

type CityProps = {
  city: City,
  isChecked: boolean
}

const CityItem =  (props: CityProps) => {
  const { city, isChecked } = props;
  const [InputChecked, updateChecked] = useState(isChecked);

  const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    updateChecked(e.currentTarget.checked);
  }

  return (
    <div key={city.geonameid} className="CityItem">
      <div className="CityItem__description">
        <p className="CityItem__description-name">{city.name}</p>
        <p className="CityItem__description-country">{city.subcountry + '- '}{city.country}</p>
      </div>
      <div className="CityItem__actions">
        <input type="checkbox" onChange={handleInputChange} checked={InputChecked}/>
      </div>
    </div>
  );
};

export default CityItem;